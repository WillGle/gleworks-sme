// Creates the SQLite database, schema, and seed data for local development.
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbFile = path.resolve(__dirname, "../data/gleworks.sqlite");
const dbFile = process.env.DB_FILE
  ? path.resolve(process.cwd(), process.env.DB_FILE)
  : defaultDbFile;

mkdirSync(path.dirname(dbFile), { recursive: true });

export const db = new Database(dbFile);

const now = () => new Date().toISOString();

const seedUsers = () => {
  const count = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  if (count > 0) {
    return;
  }

  const insertUser = db.prepare(`
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
    ) VALUES (
      @id,
      @firstName,
      @lastName,
      @phoneNumber,
      @email,
      @passwordHash,
      @dateOfBirth,
      @address,
      @city,
      @role,
      @isConfirmed,
      @createdAt,
      @updatedAt
    )
  `);

  const createdAt = now();
  insertUser.run({
    id: "admin-1",
    firstName: "Admin",
    lastName: "Gle",
    phoneNumber: "+84910000001",
    email: "admin@gle.work",
    passwordHash: bcrypt.hashSync("Admin123!", 10),
    dateOfBirth: "1995-01-01",
    address: "1 Admin Street",
    city: "Ho Chi Minh City",
    role: "admin",
    isConfirmed: 1,
    createdAt,
    updatedAt: createdAt,
  });
  insertUser.run({
    id: "user-1",
    firstName: "User",
    lastName: "Gle",
    phoneNumber: "+84910000002",
    email: "user@gle.work",
    passwordHash: bcrypt.hashSync("User123!", 10),
    dateOfBirth: "1998-05-10",
    address: "2 User Street",
    city: "Ho Chi Minh City",
    role: "user",
    isConfirmed: 1,
    createdAt,
    updatedAt: createdAt,
  });
};

const seedServices = () => {
  const count = db.prepare("SELECT COUNT(*) AS count FROM services").get().count;
  if (count > 0) {
    return;
  }

  const insertService = db.prepare(`
    INSERT INTO services (id, name, description, createdAt)
    VALUES (@id, @name, @description, @createdAt)
  `);
  const insertOption = db.prepare(`
    INSERT INTO service_options (
      serviceId,
      optionName,
      price,
      optionGroup,
      createdAt
    ) VALUES (
      @serviceId,
      @optionName,
      @price,
      @optionGroup,
      @createdAt
    )
  `);

  const createdAt = now();
  insertService.run({
    id: 1,
    name: "Switch Modding",
    description: "Lubing, filming, spring swap, and related switch work.",
    createdAt,
  });
  insertService.run({
    id: 2,
    name: "Keyboard Building",
    description: "Assembly, tuning, and quality-check support for full builds.",
    createdAt,
  });

  [
    {
      serviceId: 1,
      optionName: "Lubing",
      price: 2500,
      optionGroup: "Switch Modding Preference",
    },
    {
      serviceId: 1,
      optionName: "Filming",
      price: 2000,
      optionGroup: "Switch Modding Preference",
    },
    {
      serviceId: 1,
      optionName: "Spring Swap",
      price: 1500,
      optionGroup: "Switch Modding Preference",
    },
    {
      serviceId: 1,
      optionName: "63.5g",
      price: 500,
      optionGroup: "My Spring Preference",
    },
    {
      serviceId: 1,
      optionName: "67g",
      price: 500,
      optionGroup: "My Spring Preference",
    },
    {
      serviceId: 1,
      optionName: "70g",
      price: 500,
      optionGroup: "My Spring Preference",
    },
    {
      serviceId: 2,
      optionName: "No Desoldering Needed",
      price: 0,
      optionGroup: "Desoldering",
    },
    {
      serviceId: 2,
      optionName: "Desoldering Required",
      price: 120000,
      optionGroup: "Desoldering",
    },
    {
      serviceId: 2,
      optionName: "Assembly Only",
      price: 300000,
      optionGroup: "Assembly",
    },
    {
      serviceId: 2,
      optionName: "Assembly + Stabilizer Tuning",
      price: 420000,
      optionGroup: "Assembly",
    },
  ].forEach((option) =>
    insertOption.run({
      ...option,
      createdAt,
    })
  );
};

const seedOrders = () => {
  const count = db.prepare("SELECT COUNT(*) AS count FROM orders").get().count;
  if (count > 0) {
    return;
  }

  const insertOrder = db.prepare(`
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
    ) VALUES (
      @id,
      @userId,
      @serviceId,
      @totalCost,
      @status,
      @paymentStatus,
      @address,
      @telephone,
      @createdAt,
      @updatedAt
    )
  `);

  const insertDetail = db.prepare(`
    INSERT INTO order_details (orderId, fieldName, fieldValue, createdAt)
    VALUES (@orderId, @fieldName, @fieldValue, @createdAt)
  `);

  const createdAt = now();
  insertOrder.run({
    id: "order-1",
    userId: "user-1",
    serviceId: 1,
    totalCost: 180000,
    status: "Pending",
    paymentStatus: "Pending",
    address: "2 User Street, Ho Chi Minh City",
    telephone: "+84910000002",
    createdAt,
    updatedAt: createdAt,
  });
  insertOrder.run({
    id: "order-2",
    userId: "user-1",
    serviceId: 2,
    totalCost: 420000,
    status: "Ongoing",
    paymentStatus: "Paid",
    address: "2 User Street, Ho Chi Minh City",
    telephone: "+84910000002",
    createdAt,
    updatedAt: createdAt,
  });

  [
    {
      orderId: "order-1",
      fieldName: "Switches",
      fieldValue: "Gateron Oil King",
    },
    {
      orderId: "order-1",
      fieldName: "Amount",
      fieldValue: "70",
    },
    {
      orderId: "order-1",
      fieldName: "Switch Modding Preference",
      fieldValue: "lubing, filming",
    },
    {
      orderId: "order-2",
      fieldName: "Keyboard Kit",
      fieldValue: "Neo80",
    },
    {
      orderId: "order-2",
      fieldName: "Switches",
      fieldValue: "HMX Xinhai",
    },
    {
      orderId: "order-2",
      fieldName: "Assembly",
      fieldValue: "Assembly + Stabilizer Tuning",
    },
  ].forEach((detail) =>
    insertDetail.run({
      ...detail,
      createdAt,
    })
  );
};

export const initDatabase = () => {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phoneNumber TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      dateOfBirth TEXT,
      address TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      isConfirmed INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceId INTEGER NOT NULL,
      optionName TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      optionGroup TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      serviceId INTEGER NOT NULL,
      totalCost INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      paymentStatus TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      telephone TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS order_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      fieldName TEXT NOT NULL,
      fieldValue TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  seedUsers();
  seedServices();
  seedOrders();
};

export const getDbFile = () => dbFile;
