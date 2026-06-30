# Future Infrastructure Plan: PaaS & Staging-Oriented Architecture

This document outlines the strategic roadmap for migrating GleWorks and other future projects towards a robust, automated, and resource-efficient infrastructure.

---

## 1. Centralized Staging Environment (GitOps Pattern)

Currently, the deployment files are coupled within the project repository. For a multi-project setup, we will transition to a **Centralized Deployment Repository** (GitOps style).

### Implementation Steps:
1. **Create a Central Deploy Repo:** Create `my-staging-deployments` to house all deployment configuration (`docker-compose`, Caddyfiles, environment templates) for all projects.
2. **Establish a Shared Gateway:**
   - Create a shared Docker network on the VPS: `docker network create web-gateway`.
   - Run a single Caddy container on this network to serve as the entrypoint/reverse proxy.
3. **Configure Subdomains:** Route subdomains (e.g., `staging.gleworks.io.vn`, `staging.other-app.com`) to individual project containers connected to the `web-gateway` network.
4. **Decouple Source Repositories:** Project repos will only hold application source code, Dockerfiles, and CI/CD triggers.

---

## 2. Self-Hosted PaaS (Platform as a Service) Migration

To minimize DevOps overhead (SSL provisioning, reverse proxy routing, environment management) across various languages and stacks, we will deploy a lightweight self-hosted PaaS.

### Target Platforms:
* **Coolify (Primary Candidate):** An open-source Heroku/Render alternative. Highly visual, lightweight, supports automatic Git-push deployments, and manages SSL and domains out of the box.
* **CapRover (Secondary Candidate):** Ultra-lightweight Node.js-based PaaS, runs on Docker Swarm, consumes very little RAM, and features a 1-click app library.

---

## 3. Optimized Local CI/CD Pipeline (Docker Registry Flow)

To protect low-resource VPS nodes (like the 2GB RAM fallback server) from Out-Of-Memory (OOM) crashes during builds:

1. **Build & Test Locally (Staging):** Perform all compilation, linting, testing, and Docker builds on the local machine or a dedicated CI agent (e.g., GitHub Actions).
2. **Publish Images:** Push stable production-ready images to Docker Hub under a personal repository (e.g., `willgle/glework-frontend:latest`).
3. **Pull & Run (VPS):** Update the VPS to only pull the pre-compiled images and run them. Avoid running `docker compose up --build` or package installs (`npm install`) on the VPS.
