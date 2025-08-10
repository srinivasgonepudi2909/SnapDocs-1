FROM python:3.11-slim

# Install Poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app
COPY pyproject.toml ./
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi

COPY . .

EXPOSE 4000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
