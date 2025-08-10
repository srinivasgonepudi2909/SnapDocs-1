#!/bin/bash
cd "$(dirname "$0")/frontend" || exit

echo "🔄 Pulling latest code from Git..."
git pull

echo "🐳 Building Docker image..."
docker build --no-cache -t snapdocs-web:1.0.0 .

echo "🧹 Removing all containers..."
docker rm -f $(docker ps -aq)

echo "🚀 Starting snapdocs-web container..."
docker run -d --name snapdocs-web -p 80:80 snapdocs-web:1.0.0

echo "✅ Deployment complete."
