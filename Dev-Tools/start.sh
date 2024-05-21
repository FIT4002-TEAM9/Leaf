#!/bin/bash
echo "Building Leaf-ETL Service"
docker build -t leaf-etl ../Leaf-ETL

docker-compose -f ./docker/docker-compose.yml up -d
