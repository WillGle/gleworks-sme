# simpleBEDB

Simple Express + SQLite backend for the current GleWorks frontend.

## What it provides
- JWT auth
- SQLite database stored under `simpleBEDB/data/`
- seed data for users, services, service options, orders, and order details
- endpoints that match the frontend API calls in `src/api/*`

## Run model
- `simpleBEDB` is manual-only.
- It does not auto-start with the frontend.
- It is not wired into the root repo scripts, Docker flow, or Jenkins flow.

## Architecture
- `src/server.js`
  Express entrypoint, route handlers, response shaping, and app boot.
- `src/auth.js`
  JWT helpers plus `authRequired` and `adminOnly` middleware.
- `src/db.js`
  SQLite connection, schema creation, and seed data bootstrap.
- `data/gleworks.sqlite`
  Runtime database file created on first boot.

Data model:
- `users`
- `services`
- `service_options`
- `orders`
- `order_details`

Seeded demo data:
- 1 admin user
- 1 normal user
- 2 services
- service options for switch modding and keyboard building
- sample orders and order details for admin/user screens

## Run
```bash
cd simpleBEDB
npm install
npm run dev
```

Default server:
- `http://localhost:3001`

Default demo accounts:
- admin: `admin@gle.work` / `Admin123!`
- user: `user@gle.work` / `User123!`

Run without watch mode:
```bash
cd simpleBEDB
npm start
```

## Optional env vars
```bash
PORT=3001
JWT_SECRET=gleworks-dev-secret
DB_FILE=./data/gleworks.sqlite
```

## Frontend hookup
Point the frontend API URL to:
```txt
http://localhost:3001
```

You can do that through the runtime config in `public/config.js` or with `VITE_API_URL`.

Example:
```bash
cd /home/will/dev/GleWorks
VITE_API_URL=http://localhost:3001 npm run dev
```

## Debug
Health check:
```bash
curl http://localhost:3001/health
```

Login as admin:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@gle.work","password":"Admin123!"}'
```

List services:
```bash
curl http://localhost:3001/services
```

List service options for keyboard building:
```bash
curl http://localhost:3001/service-options/2
```

Use a JWT for protected routes:
```bash
curl http://localhost:3001/users \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

Reset the local database:
```bash
rm -f data/gleworks.sqlite
npm run dev
```

Debugging tips:
- if login fails, test `/auth/login` directly with `curl`
- if a protected route fails, check whether the token is being sent as `Bearer ...`
- if seeded data looks stale, remove `data/gleworks.sqlite` and restart
- if the frontend still calls the wrong backend, re-check `VITE_API_URL` or `public/config.js`

## API surface
Implemented endpoints:
- `GET /health`
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:userId`
- `GET /auth/auth-check`
- `GET /services`
- `GET /service-options/:serviceId`
- `GET /users`
- `GET /users/:userId`
- `PUT /users/:userId`
- `GET /orders`
- `GET /orders/user/:userId`
- `POST /orders`
- `POST /order-details`
- `GET /order-details/:orderId`
- `PUT /orders/:orderId/status`
