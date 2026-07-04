# GleWorks Portfolio Transition Plan

This is the manual execution plan for repositioning `gleworks` as a system
engineering portfolio while moving the current full-stack business app into
`gleworks-full` for later development.

This document is planning-only. Do not treat any item here as already
implemented until the matching code, deploy, and verification work is done.

## Overview

GleWorks will split into two clear repositories:

1. `gleworks`: the CV-facing static portfolio and journal site for
   Chí-Cường Nguyễn as a system engineer.
2. `gleworks-full`: the current full-stack business application for service booking,
   admin operations, order tracking, and future business features.

Repository naming rule:

- Keep `gleworks` for the public portfolio because the name is already fixed in
  the CV and public profile surface.
- Move the existing full-stack app into `gleworks-full` instead of naming the
  static repo `GleWorks-Static`.

Default domain direction:

- `gleworks.io.vn` becomes the portfolio/journal site.
- The business app moves to a subdomain such as `app.gleworks.io.vn` when it is
  ready to stay public again.

The static site must not show active service selection. Keyboard commissions are
paused while the project is rebuilt around portfolio, journal, and engineering
work.

## Static Portfolio Plan

Use `gleworks` as the static portfolio repo.

The practical split should be:

1. Create `gleworks-full` from the current full-stack repo state.
2. Verify `gleworks-full` builds and preserves the business app history.
3. Convert `gleworks` into the static portfolio surface.

Keep only the public, static-friendly surface:

- Home / landing page.
- Archive gallery from the existing keyboard work.
- Projects page.
- Journal page.
- Resume or CV page.
- Simple `/service` pause page.

Remove from the static repo:

- Service selection cards.
- Checkout flows.
- Login, signup, lost password, and reset password.
- User dashboard.
- Admin dashboard.
- API client modules.
- Backend dependency.
- Any UI that implies commissions can be ordered now.

Recommended routes:

- `/` or `/home`: system engineer landing page.
- `/projects`: engineering projects and case studies.
- `/journal`: chronological notes about work done, lessons learned, and system
  operations.
- `/archive`: visual archive of past GleWorks keyboard work.
- `/resume`: resume summary or downloadable CV link.
- `/service`: commission pause notice only.

Commission pause rule for `/service`:

- Show a short notice that keyboard commissions are temporarily paused.
- Do not show service cards.
- Do not show checkout buttons.
- Do not fetch `/services` or `/service-options`.
- Optional: link users back to `/archive` and `/projects`.

Suggested pause copy:

> Keyboard commissions are currently paused while GleWorks is being rebuilt as a
> system engineering portfolio and project journal. Past work remains available
> in the archive.

Content sources:

- `doc/CV/CV.tex` for verified career, project, and education facts.
- Existing `src/components/Archive/Archive.tsx` and `src/assets/` for past
  keyboard-work archive content.
- `deploy/README.md`, `docker-compose.yml`, `deploy/`, and `monitor/` for
  deployment, reverse proxy, CI/CD, Prometheus, and Grafana evidence.
- Homelab facts from the CV: Proxmox/KVM, TrueNAS, Docker, k3s, Prometheus, and
  Grafana.
- GleWorks platform facts: React/TypeScript, Node/Express REST API, SQLite,
  Docker, Caddy, automatic HTTPS, and CI/CD.
- Anomaly-detection/system work facts from the CV: CPU-only edge deployment,
  NixOS, low resource usage, data locality, benchmarking, and alert-threshold
  tuning.

Static site voice:

- English-first.
- Direct and technical.
- More like an online engineering journal than a marketing page.
- Keep hobby-service history visible, but make the main identity system
  engineering, infrastructure, monitoring, deployment, and operations.

## Business App Roadmap

Continue developing the full-stack business app in `gleworks-full` after the
static split. Build in the order below unless a blocking production issue
appears.

### 1. Low-RAM deploy path

Goal: make production deployment reliable on the small VPS by pulling prebuilt
images instead of building on the server.

Acceptance criteria:

- CI builds frontend and backend images.
- VPS deploy path pulls images.
- VPS deploy path does not run `npm install` or Docker builds.
- README/deploy docs match the actual active deploy path.

### 2. Guest checkout to lead

Goal: anonymous users can fill the service flow and submit a lead without
creating an account.

Acceptance criteria:

- Anonymous submission creates a `pending_confirmation` lead, not a confirmed
  order.
- Lead stores enough contact data for follow-up, including phone or Zalo.
- User is told that the order is not final until manually confirmed.
- Admin can view lead details.
- Existing authenticated order flow still works.

### 3. Admin service and price editing

Goal: admin can update service copy and option prices without touching code.

Acceptance criteria:

- Admin can edit service name and description.
- Admin can edit option prices.
- Option names remain immutable because booking logic currently matches option
  names.
- Public service forms show updated prices.

### 4. Inventory

Goal: track parts stock and basic cost.

Acceptance criteria:

- Admin can create and edit inventory items.
- Each item has stock quantity and unit cost.
- Low-stock items are visible.
- Stock deduction is controlled and not duplicated on refresh or repeated status
  updates.

### 5. Job pipeline and checklist

Goal: treat orders as work orders, not just checkout records.

Acceptance criteria:

- Order has a visible stage.
- Admin can update ETA, assignee, checklist items, and progress notes.
- Progress photo references can be attached by URL or simple stored path.
- User-facing order state stays understandable.

### 6. Finance

Goal: track whether the work is actually profitable.

Acceptance criteria:

- Track revenue, paid amount, outstanding amount, deposits, refunds, parts cost,
  and labor estimate.
- Admin can see gross revenue and estimated profit.
- Finance fields do not break existing order status and payment status filters.

### 7. Notifications and payments

Goal: reduce manual status-update friction.

Acceptance criteria:

- Customer can receive status updates through the selected channel.
- QR or MoMo payment reference can be attached to an order or invoice.
- Shipping tracking can be stored and shown after fulfillment.

### 8. Archive, promotions, and analytics

Goal: turn past work and business activity into useful public and admin content.

Acceptance criteria:

- Admin can manage archive entries.
- Promotions or coupons can be created and disabled.
- Admin can see simple analytics such as best sellers, turnaround time, and
  repeat rate.

### 9. Loyalty

Goal: reward repeat customers after the core operation flow is stable.

Acceptance criteria:

- User has a points ledger.
- Finished orders can earn points.
- Points can be redeemed as checkout discount.
- Tiers are visible but not required for the first loyalty version.

## Execution Checklist

Static split:

- [ ] Create `gleworks-full` from the current full-stack repo state.
- [ ] Verify `gleworks-full` keeps the current app history, branches, and remote
      settings needed for future development.
- [ ] Confirm the CV-facing `gleworks` repo is reserved for the static
      portfolio.
- [ ] Copy or keep only the public static app pieces in `gleworks`.
- [ ] Remove auth, admin, checkout, API, and backend code from `gleworks`.
- [ ] Rework landing page around system engineering identity.
- [ ] Add Projects page.
- [ ] Add Journal page.
- [ ] Keep Archive page for past keyboard work.
- [ ] Add Resume page or CV download link.
- [ ] Replace `/service` with commission pause notice.
- [ ] Confirm static site makes no API calls.
- [ ] Build static site successfully.
- [ ] Deploy static site to `gleworks.io.vn`.

`gleworks-full` business repo:

- [ ] Decide and document the active CI/CD path.
- [ ] Verify image-pull deploy path on the target VPS.
- [ ] Implement guest checkout to lead.
- [ ] Implement admin service and option price editing.
- [ ] Implement inventory.
- [ ] Implement job pipeline and checklist.
- [ ] Implement finance tracking.
- [ ] Implement notifications, payments, and shipping tracking.
- [ ] Implement admin-managed archive, promotions, and analytics.
- [ ] Implement loyalty after the core workflow is stable.

Verification before marking each phase done:

- [ ] Run the cheapest existing checks that apply.
- [ ] Manually verify the changed user flow.
- [ ] Update docs only after the behavior is actually true.
- [ ] Do not mark future items as implemented without evidence.

## Assumptions

- The CV-facing repo name remains `gleworks`.
- The full-stack business app moves to `gleworks-full`.
- `gleworks.io.vn` becomes the portfolio domain.
- Portfolio content is English-first.
- Commission pause is temporary but must be clear to visitors.
- No new CMS, database, or backend is needed for the first static portfolio
  version.
