#!/bin/bash

# Create project root
mkdir auth-service && cd auth-service

# Initialize Poetry project
poetry init --name "auth-service" --dependency fastapi --dependency "uvicorn[standard]" \
  --dependency sqlalchemy --dependency psycopg2-binary \
  --dependency "passlib[bcrypt]" --dependency python-jose --dependency pydantic -n

# Create app directory and files
mkdir app
touch app/__init__.py
touch app/main.py app/models.py app/schemas.py app/database.py app/routes.py

# Create Dockerfile and README
touch Dockerfile README.md

# Add basic pyproject.toml config (optional: overwrite with full config later)
echo '[tool.poetry]
name = "auth-service"
version = "0.1.0"
description = "Login/Signup microservice"
authors = ["Srinivas <you@example.com>"]
packages = [{ include = "app" }]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.110.0"
uvicorn = { extras = ["standard"], version = "^0.29.0" }
sqlalchemy = "^2.0.30"
psycopg2-binary = "^2.9.9"
passlib = { extras = ["bcrypt"], version = "^1.7.4" }
python-jose = "^3.3.0"
pydantic = "^2.7.1"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"' > pyproject.toml

# Install dependencies
poetry install

echo "✅ Project structure created. Ready to add code!"
