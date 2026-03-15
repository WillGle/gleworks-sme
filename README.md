# GleWork Frontend

React + TypeScript + Vite frontend for the Gleammy Workshop service booking and admin portal.

## Features
- Public marketing pages (landing, archive)
- Service selection and checkout flows
- User account and order history
- Admin dashboard for orders and users

## Tech Stack
- React 18, TypeScript, Vite
- React Router
- Axios
- Vitest and Testing Library
- Nginx (production image)

## Project Structure
- `src/api`: API client, domain modules, session helper, mappers, and shared types
- `src/components`: UI pages and components
- `src/assets`: images (webp)
- `public/config.js`: runtime config loaded in the browser
- `docker/`: container entrypoint

## Configuration
This app reads the API base URL at runtime when available:
- `window.__APP_CONFIG__.API_URL` from `/config.js`
- fallback: `import.meta.env.VITE_API_URL`

Auth/session storage is managed through the API session helper in `src/api/session.ts`.
Components should not read or write auth keys directly.

Local development:
- `.envrc` sets `VITE_API_URL` (direnv)
- `.env.local` can override if present

## Development
```bash
npm install
npm run dev
```

## Build and Preview
```bash
npm run build
npm run preview
```

## Lint and Tests
```bash
npm run lint
npm run test
npm run test:run
```

## Docker
Build and run with runtime API URL:
```bash
docker build -t glework-frontend .
docker run -p 8080:80 -e VITE_API_URL=http://localhost:3000 glework-frontend
```

Local stack (frontend + mock backend):
```bash
docker compose up --build
```

Frontend: `http://localhost:8080`

## CI/CD
- Jenkins is the official pipeline.
- Pipeline order: lint, type-check, test, build, image build, candidate check, deploy.
- `docker-compose.yml` is for simple local container runs.
- `build-docker.sh` is for manual image builds.

## Backend Expectations
The frontend expects an API with endpoints like:
- `POST /auth/login`, `POST /auth/register`
- `POST /auth/forgot-password`, `POST /auth/reset-password/:id`
- `GET /auth/auth-check`
- `GET /users`, `GET /users/:id`, `PUT /users/:id`
- `GET /services`, `GET /service-options/:id`
- `GET /orders`, `GET /orders/user/:id`, `POST /orders/`
- `GET /order-details/:orderId`, `POST /order-details/`
- `PUT /orders/:orderId/status`

## Backend Overview (Simple)
GleWork API is a REST backend that powers authentication, users, services, and
orders for the frontend. It returns JSON and uses JWT Bearer tokens for
protected routes. The frontend reads the API base URL from `VITE_API_URL`.

Core responsibilities:
- Auth: login/register, password reset, auth-check
- Users: profile read/update, admin list/detail
- Services: list services and service options
- Orders: create orders, list user orders, admin order updates, order details

## API Usage
Use helpers in `src/api/*` from components.

Rules:
- Components import API helpers from `src/api`.
- Components must not call `axios` or `fetch` directly.
- Components must not read or write auth storage directly.
- Backend response normalization happens in `src/api`, not in UI code.
- Global API handling for `401` and `500` responses is triggered from the shared API client and shown through a single toast in the app shell.

## Planning Docs
- `README.md` describes the current implemented repo state.
- `devops/LEARNING_PLAN.md` and `devops/IMPLEMENTATION_PLAN.md` are planning documents, not current implementation truth.
