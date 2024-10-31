#!/bin/bash
docker compose -f ./docker/docker-compose.yml down
docker compose -f ./docker/docker-compose-postgres.yml down

if echo $(docker volume ls) | grep -q "leafdb"; then
  docker volume rm leafdb
fi
