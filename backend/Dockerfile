FROM python:3.11-slim

RUN pip install --no-cache-dir poetry
WORKDIR /app

# copy only what exists
COPY pyproject.toml ./
# (optional if you have it)
# COPY poetry.lock ./

# install deps without installing the project itself
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi --no-root

# now copy the source
COPY . .
EXPOSE 4000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
