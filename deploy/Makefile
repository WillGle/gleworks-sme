# Convenience targets for the production stack. Run from the deploy/ directory.
COMPOSE = docker compose -f docker-compose.prod.yml --env-file .env

.PHONY: up down logs ps config pull validate

up: ## Build images and start the stack
	$(COMPOSE) up -d --build

down: ## Stop and remove the stack
	$(COMPOSE) down

logs: ## Tail logs
	$(COMPOSE) logs -f

ps: ## Show service status
	$(COMPOSE) ps

config: ## Render the merged, resolved compose config
	$(COMPOSE) config

validate: ## Validate Prometheus rules + Caddyfile (no daemon changes)
	docker run --rm --entrypoint promtool -v $(CURDIR)/../prometheus:/p prom/prometheus:latest \
	  check rules /p/rules/slo.yml
	docker run --rm -e DOMAIN=example.com -v $(CURDIR)/Caddyfile:/etc/caddy/Caddyfile:ro \
	  caddy:2-alpine caddy validate --adapter caddyfile --config /etc/caddy/Caddyfile
