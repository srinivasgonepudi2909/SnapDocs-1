# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Helpful tools (optional but nice for Alpine builds)
RUN apk add --no-cache libc6-compat

# Accept API base URL at build time (fallback to .env.production)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Install deps using best cache pattern
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy source and build
COPY . .
# Show full error output if build fails
ENV CI=true
RUN npm run build

# ---- runtime (nginx) ----
FROM nginx:1.27-alpine

# clean default and add SPA routing
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
