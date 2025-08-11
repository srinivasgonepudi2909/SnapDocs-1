FROM python:3.12-slim

# Install system dependencies for psycopg2 and Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry globally
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Copy poetry files first for layer caching
COPY pyproject.toml poetry.lock* ./

# Install dependencies without creating virtualenv (since container is isolated)
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# Copy the backend app code
COPY app ./app

# Switch to non-root
RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
