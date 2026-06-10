// Minimal Express API that matches the current frontend contract.
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { adminOnly, authRequired, signAuthToken } from "./auth.js";
import { db, getDbFile, initDatabase } from "./db.js";
import { metricsHandler, metricsMiddleware } from "./metrics.js";

initDatabase();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Record RED metrics for every request (see metrics.js); exposed at /metrics.
app.use(metricsMiddleware);

const mapUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  email: user.email,
  dateOfBirth: user.dateOfBirth || "",
  address: user.address || "",
  city: user.city || "",
  role: user.role,
  isConfirmed: user.isConfirmed,
  createdAt: user.createdAt,
});

const getUserByEmail = db.prepare(`
  SELECT *
  FROM users
  WHERE lower(email) = lower(?)
`);

const getUserById = db.prepare(`
  SELECT *
  FROM users
  WHERE id = ?
`);

const getServiceById = db.prepare(`
  SELECT *
  FROM services
  WHERE id = ?
`);

const getOrderRow = db.prepare(`
  SELECT
    o.id AS orderId,
    o.userId,
    o.serviceId,
    o.totalCost,
    o.status,
    o.paymentStatus,
    o.address,
    o.telephone,
    o.createdAt,
    u.id AS userNestedId,
    u.firstName AS userFirstName,
    u.lastName AS userLastName,
    u.phoneNumber AS userPhoneNumber,
    u.email AS userEmail,
    u.dateOfBirth AS userDateOfBirth,
    u.address AS userAddress,
    u.city AS userCity,
    s.id AS serviceNestedId,
    s.name AS serviceName,
    s.description AS serviceDescription
  FROM orders o
  JOIN users u ON u.id = o.userId
  JOIN services s ON s.id = o.serviceId
  WHERE o.id = ?
`);

const listOrderRows = db.prepare(`
  SELECT
    o.id AS orderId,
    o.userId,
    o.serviceId,
    o.totalCost,
    o.status,
    o.paymentStatus,
    o.address,
    o.telephone,
    o.createdAt,
    u.firstName AS userFirstName,
    u.lastName AS userLastName,
    u.email AS userEmail,
    s.id AS serviceNestedId,
    s.name AS serviceName
  FROM orders o
  JOIN users u ON u.id = o.userId
  JOIN services s ON s.id = o.serviceId
  ORDER BY datetime(o.createdAt) DESC
`);

const listUserOrderRows = db.prepare(`
  SELECT
    o.id AS orderId,
    o.userId,
    o.serviceId,
    o.totalCost,
    o.status,
    o.paymentStatus,
    o.address,
    o.telephone,
    o.createdAt,
    s.id AS serviceNestedId,
    s.name AS serviceName
  FROM orders o
  JOIN services s ON s.id = o.serviceId
  WHERE o.userId = ?
  ORDER BY datetime(o.createdAt) DESC
`);

const mapOrderRow = (row, includeUser = true) => ({
  orderId: row.orderId,
  userId: row.userId,
  serviceId: row.serviceId,
  createdAt: row.createdAt,
  totalCost: row.totalCost,
  paymentStatus: row.paymentStatus,
  status: row.status,
  address: row.address,
  telephone: row.telephone,
  ...(includeUser
    ? {
        User: {
          firstName: row.userFirstName,
          lastName: row.userLastName,
          email: row.userEmail,
        },
      }
    : {}),
  Service: {
    id: row.serviceNestedId,
    name: row.serviceName,
  },
});

const canAccessUser = (auth, userId) =>
  auth.role === "admin" || auth.sub === userId;

const canAccessOrder = (auth, order) =>
  auth.role === "admin" || auth.sub === order.userId;

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    dbFile: getDbFile(),
  });
});

// Prometheus scrape endpoint: RED metrics (rate/errors/duration) + process metrics.
app.get("/metrics", metricsHandler);

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const user = getUserByEmail.get(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const token = signAuthToken(user);
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    token,
  });
});

app.post("/auth/register", (req, res) => {
  const { firstName, lastName, phoneNumber, dateOfBirth, email, password } =
    req.body ?? {};

  if (!firstName || !lastName || !phoneNumber || !email || !password) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  if (getUserByEmail.get(email)) {
    res.status(409).json({ message: "Email already exists." });
    return;
  }

  const createdAt = new Date().toISOString();
  const id = randomUUID();
  db.prepare(`
    INSERT INTO users (
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      passwordHash,
      dateOfBirth,
      address,
      city,
      role,
      isConfirmed,
      createdAt,
      updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, '', '', 'user', 1, ?, ?)
  `).run(
    id,
    firstName,
    lastName,
    phoneNumber,
    email,
    bcrypt.hashSync(password, 10),
    dateOfBirth || "",
    createdAt,
    createdAt
  );

  res.status(201).json({
    message:
      "Registration successful! A confirmation email has been sent to your email address.",
  });
});

app.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body ?? {};
  if (!email) {
    res.status(400).json({ message: "Email is required." });
    return;
  }

  res.json({
    message: "Reset link sent successfully!",
  });
});

app.post("/auth/reset-password/:userId", (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body ?? {};
  const user = getUserById.get(userId);

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  if (!newPassword) {
    res.status(400).json({ message: "New password is required." });
    return;
  }

  db.prepare(`
    UPDATE users
    SET passwordHash = ?, updatedAt = ?
    WHERE id = ?
  `).run(bcrypt.hashSync(newPassword, 10), new Date().toISOString(), userId);

  res.json({ message: "Password updated successfully." });
});

app.get("/auth/auth-check", authRequired, (req, res) => {
  const user = getUserById.get(req.auth.sub);
  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  res.json({
    user: mapUser(user),
  });
});

app.get("/services", (_req, res) => {
  const services = db
    .prepare(
      `
        SELECT id, name, description
        FROM services
        ORDER BY id
      `
    )
    .all();

  res.json(services);
});

app.get("/service-options/:serviceId", (req, res) => {
  const serviceId = Number(req.params.serviceId);
  if (!getServiceById.get(serviceId)) {
    res.status(404).json({ message: "Service not found." });
    return;
  }

  const options = db
    .prepare(
      `
        SELECT id, optionName, price, optionGroup
        FROM service_options
        WHERE serviceId = ?
        ORDER BY id
      `
    )
    .all(serviceId);

  res.json({ options });
});

app.get("/users", authRequired, adminOnly, (_req, res) => {
  const users = db
    .prepare(
      `
        SELECT
          id,
          firstName,
          lastName,
          phoneNumber,
          email,
          dateOfBirth,
          address,
          city,
          role,
          isConfirmed,
          createdAt
        FROM users
        ORDER BY datetime(createdAt) DESC
      `
    )
    .all();

  res.json(users);
});

app.get("/users/:userId", authRequired, (req, res) => {
  const { userId } = req.params;
  if (!canAccessUser(req.auth, userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const user = getUserById.get(userId);
  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  res.json(mapUser(user));
});

app.put("/users/:userId", authRequired, (req, res) => {
  const { userId } = req.params;
  if (!canAccessUser(req.auth, userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const user = getUserById.get(userId);
  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const nextUser = {
    firstName: req.body.firstName ?? user.firstName,
    lastName: req.body.lastName ?? user.lastName,
    phoneNumber: req.body.phoneNumber ?? user.phoneNumber,
    email: req.body.email ?? user.email,
    dateOfBirth: req.body.dateOfBirth ?? user.dateOfBirth,
    address: req.body.address ?? user.address,
    city: req.body.city ?? user.city,
  };

  db.prepare(`
    UPDATE users
    SET
      firstName = ?,
      lastName = ?,
      phoneNumber = ?,
      email = ?,
      dateOfBirth = ?,
      address = ?,
      city = ?,
      updatedAt = ?
    WHERE id = ?
  `).run(
    nextUser.firstName,
    nextUser.lastName,
    nextUser.phoneNumber,
    nextUser.email,
    nextUser.dateOfBirth,
    nextUser.address,
    nextUser.city,
    new Date().toISOString(),
    userId
  );

  res.json({
    ...mapUser(getUserById.get(userId)),
  });
});

app.get("/orders", authRequired, adminOnly, (_req, res) => {
  const orders = listOrderRows.all().map((row) => mapOrderRow(row, true));
  res.json(orders);
});

app.get("/orders/user/:userId", authRequired, (req, res) => {
  const { userId } = req.params;
  if (!canAccessUser(req.auth, userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const orders = listUserOrderRows
    .all(userId)
    .map((row) => mapOrderRow(row, false));

  res.json(orders);
});

app.post("/orders", authRequired, (req, res) => {
  const {
    userId,
    serviceId,
    totalCost,
    status,
    paymentStatus,
    address,
    telephone,
  } = req.body ?? {};

  if (!userId || !serviceId || !status || !paymentStatus) {
    res.status(400).json({ message: "Missing required order fields." });
    return;
  }

  if (!canAccessUser(req.auth, userId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  if (!getUserById.get(userId) || !getServiceById.get(Number(serviceId))) {
    res.status(404).json({ message: "Related user or service was not found." });
    return;
  }

  const orderId = randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO orders (
      id,
      userId,
      serviceId,
      totalCost,
      status,
      paymentStatus,
      address,
      telephone,
      createdAt,
      updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    orderId,
    userId,
    Number(serviceId),
    Number(totalCost) || 0,
    status,
    paymentStatus,
    address || "",
    telephone || "",
    createdAt,
    createdAt
  );

  res.status(201).json({ orderId });
});

app.post("/order-details", authRequired, (req, res) => {
  const { orderId, fieldName, fieldValue } = req.body ?? {};
  if (!orderId || !fieldName) {
    res.status(400).json({ message: "Missing required order detail fields." });
    return;
  }

  const order = getOrderRow.get(orderId);
  if (!order) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  if (!canAccessOrder(req.auth, order)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const result = db.prepare(`
    INSERT INTO order_details (orderId, fieldName, fieldValue, createdAt)
    VALUES (?, ?, ?, ?)
  `).run(orderId, fieldName, fieldValue ?? null, new Date().toISOString());

  res.status(201).json({
    id: String(result.lastInsertRowid),
    orderId,
    fieldName,
    fieldValue: fieldValue ?? null,
  });
});

app.get("/order-details/:orderId", authRequired, (req, res) => {
  const { orderId } = req.params;
  const order = getOrderRow.get(orderId);

  if (!order) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  if (!canAccessOrder(req.auth, order)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const details = db
    .prepare(
      `
        SELECT id, fieldName, fieldValue
        FROM order_details
        WHERE orderId = ?
        ORDER BY id
      `
    )
    .all(orderId);

  const orderPayload = {
    orderId: order.orderId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalCost: order.totalCost,
    createdAt: order.createdAt,
    address: order.address,
    telephone: order.telephone,
    User: {
      id: order.userNestedId,
      firstName: order.userFirstName,
      lastName: order.userLastName,
      phoneNumber: order.userPhoneNumber,
      email: order.userEmail,
      dateOfBirth: order.userDateOfBirth || "",
      address: order.userAddress || "",
      city: order.userCity || "",
    },
  };

  if (details.length === 0) {
    res.json([{ orderId, Order: orderPayload }]);
    return;
  }

  res.json(
    details.map((detail) => ({
      id: String(detail.id),
      orderId,
      fieldName: detail.fieldName,
      fieldValue: detail.fieldValue,
      Order: orderPayload,
    }))
  );
});

app.put("/orders/:orderId/status", authRequired, adminOnly, (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body ?? {};
  const order = getOrderRow.get(orderId);

  if (!order) {
    res.status(404).json({ message: "Order not found." });
    return;
  }

  db.prepare(`
    UPDATE orders
    SET status = ?, paymentStatus = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    status ?? order.status,
    paymentStatus ?? order.paymentStatus,
    new Date().toISOString(),
    orderId
  );

  const updatedOrder = getOrderRow.get(orderId);
  res.json({
    status: updatedOrder.status,
    paymentStatus: updatedOrder.paymentStatus,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

app.listen(port, () => {
  console.log(`simpleBEDB listening on http://localhost:${port}`);
  console.log(`SQLite file: ${getDbFile()}`);
});
