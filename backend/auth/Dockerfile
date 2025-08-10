FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3

WORKDIR /app

# Optional build deps (helpful for bcrypt if wheels not available)
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir "poetry==${POETRY_VERSION}"

# Copy Poetry files first for better layer caching
COPY pyproject.toml poetry.toml /app/

# Install dependencies (no venv, no root package)
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi --no-root

# Copy application code
COPY app/ /app/app/
# Copy env file (if you want it inside the image; otherwise mount)
COPY .env /app/.env

EXPOSE 4500

# Because we disabled the virtualenv, uvicorn is available in the global site-packages
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4500"]
