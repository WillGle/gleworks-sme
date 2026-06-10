// Prometheus instrumentation for the GleWorks API.
// Exposes RED metrics (Rate, Errors, Duration) so Prometheus can scrape /metrics
// and Grafana/Alerting can drive SLIs/SLOs (availability + p95 latency).
import client from "prom-client";

// A dedicated registry keeps our metrics isolated and testable.
export const register = new client.Registry();

// Default process/runtime metrics (CPU, memory, event-loop lag, GC, ...).
client.collectDefaultMetrics({ register, prefix: "gleworks_" });

// --- RED metrics -----------------------------------------------------------

// Rate + Errors: one counter, sliced by method / route / status_code.
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests, labelled by method, route and status code.",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Duration: a histogram so we can compute p50/p95/p99 with histogram_quantile().
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds, labelled by method, route and status code.",
  labelNames: ["method", "route", "status_code"],
  // Buckets tuned for a small JSON API (5ms .. 5s).
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

// Middleware: time every request and record it on response 'finish'.
// We label by the matched Express ROUTE PATTERN (e.g. /users/:userId), not the
// raw URL, to keep label cardinality bounded (no per-id explosion).
export const metricsMiddleware = (req, res, next) => {
  if (req.path === "/metrics") {
    next();
    return;
  }
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : "unmatched";
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    httpRequestsTotal.inc(labels);
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestDuration.observe(labels, durationSeconds);
  });
  next();
};

// Handler for GET /metrics in Prometheus text exposition format.
export const metricsHandler = async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};
