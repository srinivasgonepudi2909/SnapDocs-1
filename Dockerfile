# -----------------------------
# Stage 1: Build the React app
# -----------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Choose your installer (npm by default)
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else npm i; fi

# Copy the rest and build
COPY . .
# Build for Vite -> dist (CRA users: set REACT_BUILD_DIR=build at build time)
ARG REACT_BUILD_DIR=dist
ENV REACT_BUILD_DIR=${REACT_BUILD_DIR}
RUN npm run build || yarn build || (corepack enable && pnpm build)

# ------------------------------------
# Stage 2: Serve static files via Nginx
# ------------------------------------
FROM nginx:1.27-alpine

# Clean default config and add our SPA config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/nginx.conf

# Copy built assets
ARG REACT_BUILD_DIR=dist
COPY --from=build /app/${REACT_BUILD_DIR} /usr/share/nginx/html

# Health + permissions
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
