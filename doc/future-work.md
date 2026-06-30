# Future Work — Application Features

Backlog of application-level features that were proposed but deferred.
(Infrastructure roadmap lives in [`future-plan.md`](./future-plan.md).)

---

## 1. Admin: edit service content & prices

**Status:** Proposed, deferred — full-stack feature; revisit after deploy / once
comfortable defending backend changes end-to-end.

**Goal:** After logging in, an admin can adjust a service's **content**
(name, description) and each option's **price**.

### Chosen scope
- Editable: service `name` + `description`, and each option's `price`.
- **Deliberately excluded:** editing option *names*. The booking flow
  (`Service/Build.tsx`, `CheckoutBuild.tsx`, `Switch.tsx`) matches options by
  hardcoded name strings (e.g. "Desoldering Required", "Assembly Only"), so
  renaming an option would silently break order logic. Editing only prices is
  safe because the booking flow uses the numeric price directly.

### Current data model
- `services`: `id, name, description, createdAt`
- `service_options`: `id, serviceId, optionName, price, optionGroup`
- Backend exposes **GET only**: `GET /services`, `GET /service-options/:serviceId`.

### Backend (`simpleBEDB/src/server.js`)
- `PUT /services/:id` — `authRequired` + `adminOnly` → update `name`, `description`.
- `PUT /service-options/:id` — `authRequired` + `adminOnly` → update `price`.
- Add UPDATE prepared statements; mirror the existing `PUT /users/:userId`
  admin-only pattern already in the file.

### Frontend API (`src/api/services.ts` + `src/api/types.ts`)
- `updateService(id, { name, description })` → `PUT /services/:id`
- `updateServiceOption(id, { price })` → `PUT /service-options/:id`
- New types: `UpdateServicePayload`, `UpdateServiceOptionPayload`.
- Re-export from the `@api` barrel (`src/api/index.ts`).

### Frontend UI
- New admin section **"Services Management"**:
  - Add a link to `AdminPageLayout`'s `ADMIN_LINKS` → `/admin/services`.
  - Routes `/admin/services` (list) + `/admin/services/:serviceId` (edit),
    mirroring Users Management (`AdminUserList` → `AdminUserDetail`).
  - Edit page: editable `name` + `description`; a table of options with
    read-only name + editable `price`; a Save button that calls
    `updateService` + `updateServiceOption`.

### Why deferred
Spans new backend endpoints + DB writes + an admin CRUD screen — beyond the
current "frontend + basic Docker" comfort zone, and not worth claiming in
interviews until understood end to end. Good candidate to pick up after the
live deploy is done, as a way to learn backend mutations on familiar code.

**Effort:** ~Medium (2 backend endpoints, ~2 frontend components + API + routing).
