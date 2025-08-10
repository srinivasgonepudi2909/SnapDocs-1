#!/bin/bash

# Step 1: Pull latest code
echo "🔄 Pulling latest code from Git..."
git pull

# Step 2: Build Docker image
echo "🐳 Building Docker image..."
docker build --no-cache -t snapdocs-web:1.0.0 .

# Step 3: Stop and remove all running containers (use with caution!)
echo "🧹 Removing all containers..."
docker rm -f $(docker ps -aq)

# Step 4: Run the new container
echo "🚀 Starting snapdocs-web container..."
docker run -d --name snapdocs-web -p 80:80 snapdocs-web:1.0.0

echo "✅ Deployment complete."
