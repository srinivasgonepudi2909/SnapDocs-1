FROM python:3.11-slim

RUN pip install --no-cache-dir poetry
WORKDIR /app

COPY pyproject.toml ./
# COPY poetry.lock ./    # (optional if you have it)
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi --no-root

COPY . .
EXPOSE 4000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
