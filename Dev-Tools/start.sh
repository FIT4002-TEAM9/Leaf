#!/bin/bash
echo "Building Postgres DB"
docker volume create leafdb
docker build -t leaf-etl-postgres ../Leaf-ETL/postgres

echo "Building Leaf-ETL Service"
docker build -t leaf-etl ../Leaf-ETL

echo "Starting Docker Containers"
docker compose -f ./docker/docker-compose.yml up -d
