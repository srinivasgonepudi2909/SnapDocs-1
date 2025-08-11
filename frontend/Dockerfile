# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# src
COPY . .

# DEBUG: show what’s in the image
RUN node -v && npm -v && \
    ls -la && \
    echo "--- src tree ---" && find src -maxdepth 3 -type f | sort && \
    echo "--- package.json ---" && cat package.json

ENV CI=true
RUN npm run build
