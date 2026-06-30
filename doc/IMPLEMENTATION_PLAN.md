# Implementation Plan - GleWorks DevOps Integration

> Status: this file is a proposal/history document. It is not the source of truth for the current repo state.

## Current Repo Baseline
Before adding more DevOps layers, the repo already contains:

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`
- `build-docker.sh`
- `docker/entrypoint.sh`
- `nginx.conf`
- `Jenkinsfile`
- `flake.nix` and `.envrc`
- `public/config.js` and `src/config.ts` for frontend runtime API config

Current CI/CD reality:
- Jenkins is the active pipeline in the repo.
- GitHub Actions workflow file is not present anymore.
- Azure pipeline file is not present anymore.

## Still Planned, Not Implemented Here
The items below are still future work unless they are added in a later branch:

- `k8s/` or `k8s-manifests/`
- `terraform/`
- Ansible playbooks or vault setup inside this repo
- Argo CD app definitions
- NixOS host-level config files outside this repo

## Proposed Next DevOps Layers

### 1. Kubernetes Manifests
Goal:
- run the frontend on a local or remote Kubernetes cluster

Expected additions:
- deployment manifest
- service manifest
- ingress manifest

Suggested repo location:
- `k8s/`

### 2. Terraform
Goal:
- manage cluster-facing infrastructure or namespaces with code

Suggested repo location:
- `terraform/`

Possible first targets:
- namespace creation
- resource quotas
- ingress-related infrastructure

### 3. Ansible
Goal:
- automate host preparation, secrets management, or repeated maintenance tasks

Possible future tasks:
- secret bootstrap
- backup tasks
- node preparation

### 4. GitOps
Goal:
- let a cluster reconcile from Git instead of manual deploy commands

Possible future tooling:
- Argo CD

## Verification Approach for Future Work

### Repo-Level Verification
- `npm run lint`
- `npm run type-check`
- `npm run test:run`
- `npm run build`

### Infra-Level Verification
Examples for later phases:
- `kubectl get pods`
- `kubectl get svc`
- `kubectl get ingress`
- `terraform plan`
- `ansible-playbook --check`

## Notes
- Keep `README.md` as the source of truth for what already exists.
- Keep this file focused on proposed infrastructure work that is not yet part of the implemented repo.
