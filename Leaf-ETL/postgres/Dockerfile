FROM postgres:15.1-alpine

LABEL author="Group 8"
LABEL description="Postgres image for local development"
LABEL version="1.0"

# Copies sql files into our db init file, can be used for test data
COPY ./data/*.sql /docker-entrypoint-initdb.d/
