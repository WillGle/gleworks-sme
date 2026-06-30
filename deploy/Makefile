# Convenience targets for the production stack. Run from the deploy/ directory.
COMPOSE_FILE ?= docker-compose.prod.yml
COMPOSE = docker compose -f $(COMPOSE_FILE) --env-file .env

# Registry images — build these on a dev box (amd64) and push, so a low-RAM VPS
# only ever pulls. Override on the CLI, e.g.: make build-push NAMESPACE=gleammy TAG=v1
NAMESPACE ?= gleammy
TAG ?= latest
PLATFORM ?= linux/amd64
FRONTEND_IMAGE ?= $(NAMESPACE)/glework-frontend:$(TAG)
BACKEND_IMAGE  ?= $(NAMESPACE)/glework-backend:$(TAG)

.PHONY: up down logs ps config pull deploy validate build-push

up: ## Build images and start the stack
	$(COMPOSE) up -d --build

build-push: ## Build registry images (amd64) and push — run on a dev box, NOT the 2GB VPS
	docker build --platform $(PLATFORM) -t $(FRONTEND_IMAGE) -f ../Dockerfile ..
	docker build --platform $(PLATFORM) -t $(BACKEND_IMAGE) -f ../simpleBEDB/Dockerfile ../simpleBEDB
	docker push $(FRONTEND_IMAGE)
	docker push $(BACKEND_IMAGE)
	@echo ""
	@echo "Pushed. On the VPS put these in deploy/.env, then: make deploy COMPOSE_FILE=docker-compose.fallback.yml"
	@echo "  FRONTEND_IMAGE=$(FRONTEND_IMAGE)"
	@echo "  BACKEND_IMAGE=$(BACKEND_IMAGE)"

deploy: pull ## Pull latest images and start the stack without building
	$(COMPOSE) up -d

pull: ## Pull latest images from the registry
	$(COMPOSE) pull

down: ## Stop and remove the stack
	$(COMPOSE) down

logs: ## Tail logs
	$(COMPOSE) logs -f

ps: ## Show service status
	$(COMPOSE) ps

config: ## Render the merged, resolved compose config
	$(COMPOSE) config

validate: ## Validate Prometheus rules + Caddyfile (no daemon changes)
	docker run --rm --entrypoint promtool -v $(CURDIR)/../monitor/prometheus:/p prom/prometheus:latest \
	  check rules /p/rules/slo.yml
	docker run --rm -e DOMAIN=example.com -v $(CURDIR)/Caddyfile:/etc/caddy/Caddyfile:ro \
	  caddy:2-alpine caddy validate --adapter caddyfile --config /etc/caddy/Caddyfile
