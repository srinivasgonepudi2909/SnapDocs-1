# Dockerfile for SnapDocs React app
# ----------------------------------

# Stage 1: Build React app with Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app (Vite outputs to dist/)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

# Remove default Nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Add custom Nginx config for SPA routing
COPY deploy/nginx.conf /etc/nginx/nginx.conf

# Copy build output from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]