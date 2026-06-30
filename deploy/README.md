# GleWorks — Live Deploy (Infrastructure as Code)

Reproducible, one-command deployment of the full GleWorks stack to a public VPS
with automatic HTTPS and observability. This is the IaC that backs the CV claims:

| CV claim | Backed by |
|---|---|
| Containerized; shipped via CI/CD | `Dockerfile`, `simpleBEDB/Dockerfile`, `Jenkinsfile` |
| Reverse proxy, same-origin `/api`, TLS | `nginx.conf` (SPA + `/api`), `deploy/Caddyfile` (auto-HTTPS) |
| Prometheus + Grafana, RED metrics | `simpleBEDB/src/metrics.js`, `monitor/prometheus/`, `monitor/grafana/` |
| **SLO / error-budget alerting** | `monitor/prometheus/rules/slo.yml` |
| **Provisions infrastructure as code** | `deploy/ansible/playbook.yml`, `deploy/docker-compose.prod.yml` |

## Architecture

```
internet ──443──> caddy (auto-TLS) ──> frontend (nginx: SPA + /api proxy) ──> backend (Express + SQLite, /metrics)
                                                                                  │
                                          prometheus (scrape /metrics, SLO rules) ┘
                                          grafana   (dashboards)        [internal; grafana optionally public read-only]
```

## Prerequisites

1. A VPS (Ubuntu 22.04/24.04 or Debian 12), SSH access.
2. A domain with a DNS **A record** pointing to the VPS IP (needed for Let's Encrypt).
3. Ports 80 and 443 open to the internet (cloud security group / firewall).

## Deploy with Ansible (recommended)

```bash
cd deploy/ansible
cp inventory.ini.example inventory.ini      # set your VPS IP
ansible-playbook -i inventory.ini playbook.yml \
  -e domain=demo.yourdomain.com \
  -e jwt_secret="$(openssl rand -hex 32)" \
  -e grafana_admin_password='a-strong-password'
```

The playbook installs Docker + Compose, clones the repo to `/opt/gleworks`,
writes `deploy/.env`, and runs `docker compose ... up -d --build`. Re-running it
is idempotent (it updates the repo and re-applies the stack).

## Deploy manually

### Full Stack (with Prometheus + Grafana)
```bash
# on the VPS, after installing Docker + the compose plugin:
git clone https://github.com/WillGle/GleWorks.git && cd GleWorks/deploy
cp .env.example .env && $EDITOR .env          # set DOMAIN, JWT_SECRET, GRAFANA_ADMIN_PASSWORD
make up                                        # or: docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

### Lightweight Fallback Stack (No Prometheus/Grafana — recommended for 2 GB RAM VPS)
```bash
# on the VPS:
git clone https://github.com/WillGle/GleWorks.git && cd GleWorks/deploy
cp .env.example .env && $EDITOR .env          # set DOMAIN, JWT_SECRET (GRAFANA_ADMIN_PASSWORD can be ignored)
docker compose -f docker-compose.fallback.yml --env-file .env up -d --build
```

Visit `https://$DOMAIN` — Caddy obtains a certificate automatically on first request.

## Verify

```bash
make ps
curl -fsS https://$DOMAIN/                       # SPA
curl -fsS https://$DOMAIN/api/health             # {"status":"ok",...}
# admin tools are internal — reach them over an SSH tunnel:
ssh -L 9090:127.0.0.1:9090 user@vps             # then open http://localhost:9090/rules  (SLO rules loaded)
```

Demo logins (seeded): `admin@gle.work / Admin123!`, `user@gle.work / User123!`.

## Validate config without a VPS

`docker` is the only requirement:

```bash
cd deploy
make validate                                   # promtool checks SLO rules + caddy validates the Caddyfile
docker compose -f docker-compose.prod.yml --env-file .env config   # resolve & lint the prod topology
ansible-playbook --syntax-check ansible/playbook.yml
```

## Local smoke test (dev topology)

The base `docker-compose.yml` (repo root) runs the same images with ports bound to
localhost for testing the full stack on your machine before shipping:

```bash
docker compose up -d --build
curl -fsS localhost:8080/             # frontend
curl -fsS 127.0.0.1:3001/health       # backend
curl -fsS 127.0.0.1:9090/api/v1/rules # Prometheus has the SLO rules loaded
docker compose down
```

## Notes / next steps

- Secrets (`deploy/.env`) are git-ignored; in production prefer Ansible Vault or
  the VPS provider's secret store over plaintext `-e` vars.
- Alerts currently evaluate in Prometheus. To deliver notifications, add
  Alertmanager + a receiver (Slack/email) — the rules in `monitor/prometheus/rules/slo.yml`
  already emit the alerts.
- To show the live SLO dashboard publicly, uncomment the `grafana.{$DOMAIN}` block
  in `Caddyfile`, set `GRAFANA_ANON_ENABLED=true`, and add the subdomain's DNS record.
