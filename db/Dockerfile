FROM postgres:16-alpine

# set default DB values (can be overridden by compose env)
ENV POSTGRES_DB=docuvault \
    POSTGRES_USER=docuuser \
    POSTGRES_PASSWORD=docupass

# bootstrap schema + constraints
COPY init.sql /docker-entrypoint-initdb.d/init.sql
