FROM python:3.12-slim

# Install Poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy pyproject.toml & poetry.lock first for caching
COPY pyproject.toml poetry.lock* ./

# Install dependencies (no dev deps in container)
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --only main

# Copy app code
COPY app ./app

# Expose port
EXPOSE 4000

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
