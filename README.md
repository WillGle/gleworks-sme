# GleWork Frontend

React + TypeScript + Vite frontend for the Gleammy Workshop service booking and admin portal.

## Current State
- `main` is the current source of truth.
- The app uses the newer `src/api/*` module structure instead of the old `apiService.ts` pattern.
- Runtime API configuration exists through `public/config.js` and `src/config.ts`.
- Global UI handling for authenticated `401` and server-side `500` API failures is mounted in the app shell.
- The repo includes Docker, Jenkins, Vitest, ESLint, and optional Nix/direnv local tooling.

## Features
- Public marketing pages such as landing and archive
- Service selection and checkout flows
- User account and order history
- Admin dashboard for orders and users
- Route protection for user and admin areas
- Global API error toast for central session and server error feedback

## Tech Stack
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Vitest and Testing Library
- ESLint
- Nginx for the production image
- Optional Nix flake + direnv for local setup

## Project Structure
- `src/api`
  API client, session helpers, error normalization, mappers, and domain modules
- `src/components`
  App pages, layouts, shared UI, and feature flows
- `src/test`
  Unit and integration-style UI/API tests
- `src/assets`
  Static image assets used by the site
- `public/config.js`
  Runtime browser config stub
- `docker/entrypoint.sh`
  Helper script for generating `config.js` at container startup
- `devops/*.md`
  Planning documents, not current implementation truth

## API Layer
The API layer is now the main boundary between the UI and the backend.

Current modules:
- `src/api/auth.ts`
- `src/api/orders.ts`
- `src/api/services.ts`
- `src/api/users.ts`
- `src/api/session.ts`
- `src/api/errors.ts`
- `src/api/errorEvents.ts`
- `src/api/mappers.ts`
- `src/api/types.ts`
- `src/api/index.ts`

Rules:
- Components import API helpers from `@api` or `src/api`.
- Components must not call `axios` or `fetch` directly.
- Components must not read or write auth storage directly.
- Backend response normalization belongs in `src/api/mappers.ts`, not in UI components.
- Global `401` and `500` handling is triggered from the shared API client.

## Auth and Error Handling
- Browser session data is centralized in `src/api/session.ts`.
- Protected requests receive the bearer token through `src/api/client.ts`.
- Authenticated `401` responses clear the session and route users back to login.
- `500` responses are surfaced through `GlobalApiErrorToast`.

Current note:
- Tokens are still stored in `localStorage`. That is a known temporary risk and should eventually move to a safer backend-driven auth approach such as `httpOnly` cookies.

## Runtime Configuration
The app resolves the API base URL in this order:

1. `window.__APP_CONFIG__.API_URL` from `/config.js`
2. `import.meta.env.VITE_API_URL`

Current files involved:
- `public/config.js`
- `src/config.ts`
- `docker/entrypoint.sh`

## Local Development
Recommended local setup if you use Nix and direnv:

```bash
direnv allow
```

That loads:
- the Nix flake environment
- `NODE_ENV=development`
- `VITE_PORT=5173`
- `VITE_API_URL=http://localhost:3000`

If you do not use direnv/Nix:

```bash
npm install
npm run dev
```

Optional local override:
- `.env.local`

## Scripts
Main scripts in `package.json`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run type-check
npm run test
npm run test:run
npm run test:coverage
```

## Testing
Current automated coverage includes:
- app route smoke tests
- protected route behavior
- login, forgot-password, and reset-password flows
- API module behavior
- session helper behavior
- payload mapper behavior
- global API error toast behavior

Vitest config lives in:
- `vitest.config.ts`

## Build and Preview
```bash
npm run build
npm run preview
```

## Aliases
Configured aliases currently include:
- `@`
- `@api`
- `@components`
- `@pages`
- `@utils`
- `@hooks`

These are configured in:
- `vite.config.ts`
- `vitest.config.ts`
- `tsconfig.json`

## Docker
Current Docker-related files:
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`
- `build-docker.sh`
- `docker/entrypoint.sh`
- `nginx.conf`

Manual image build:
```bash
./build-docker.sh
./build-docker.sh my-tag
```

Direct Docker usage:
```bash
docker build -t glework-frontend:latest .
docker run -p 8080:80 glework-frontend:latest
```

Compose helper:
```bash
docker compose up --build
```

Current limitation:
- `docker/entrypoint.sh` exists for runtime `config.js` generation, but the current `Dockerfile` does not wire that script in yet.
- That means the shipped image currently behaves like a static build unless `config.js` is otherwise provided.

## CI/CD
Jenkins is the active CI/CD path in this repo.

Current Jenkins flow:
1. Checkout
2. Install dependencies
3. Lint
4. Type check
5. Test
6. Build app
7. Build Docker image
8. Verify candidate container on `8081`
9. Deploy live container on `8080`
10. Cleanup

Current status:
- Jenkinsfile is active
- GitHub Actions workflow file is no longer present
- Azure pipeline file is no longer present

## Backend Expectations
The frontend expects a REST API with endpoints such as:
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:id`
- `GET /auth/auth-check`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `GET /services`
- `GET /service-options/:id`
- `GET /orders`
- `GET /orders/user/:id`
- `POST /orders/`
- `GET /order-details/:orderId`
- `POST /order-details/`
- `PUT /orders/:orderId/status`

## Documentation Notes
- `README.md` is the source of truth for the current implemented repo state.
- `devops/LEARNING_PLAN.md` and `devops/IMPLEMENTATION_PLAN.md` remain planning documents.
