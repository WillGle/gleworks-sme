# Convenience targets for the production stack. Run from the deploy/ directory.
COMPOSE_FILE ?= docker-compose.prod.yml
COMPOSE = docker compose -f $(COMPOSE_FILE) --env-file .env

.PHONY: up down logs ps config pull deploy validate

up: ## Build images and start the stack
	$(COMPOSE) up -d --build

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
