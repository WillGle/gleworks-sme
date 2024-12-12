# Stage 1: Build the React application
FROM node:18 AS builder

WORKDIR /app

# Copy only necessary files (optimize caching)
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose only required ports
EXPOSE 443
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
