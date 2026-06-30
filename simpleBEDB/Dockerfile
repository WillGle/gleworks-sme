# Build stage - install deps (better-sqlite3 builds its native binding here,
# against the container's Node 20 / glibc, so no host ABI mismatch)
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime stage - slim image, same glibc family so the native binding just works
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3001
CMD ["node", "--max-old-space-size=128", "src/server.js"]
