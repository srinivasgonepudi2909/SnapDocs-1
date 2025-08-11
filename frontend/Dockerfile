# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install helpful tools
RUN apk add --no-cache libc6-compat

# Accept API base URL at build time (fallback to .env.production)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy source code (excluding node_modules)
COPY . .

# Show full error output if build fails
ENV CI=true
RUN npm run build

# ---- runtime (nginx) ----
FROM nginx:1.27-alpine

# Remove default config and add SPA routing
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Optional: Add healthcheck for nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
