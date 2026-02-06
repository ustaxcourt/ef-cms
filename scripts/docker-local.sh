#!/bin/bash -e

export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Determine the docker compose invocation.
if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi

DESTINATION_TAG=$(grep 'docker-image:' .circleci/config.yml | awk -F':' '{print $3}')
LOCAL_IMAGE_NAME="ef-cms-us-east-1:${DESTINATION_TAG}"

$DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes || true
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes || true

# ensure the container names are not in use
docker rm -f shell api client public dawson-db opensearch-node &> /dev/null || true

docker build --platform=linux/amd64 -t "$LOCAL_IMAGE_NAME" -f Dockerfile .
"$DOCKER_COMPOSE" up --build
