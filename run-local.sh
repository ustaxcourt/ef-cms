#!/bin/bash
# Used for running the API and necessary services (s3, opensearch) locally

# shellcheck disable=SC1091
. ./setup-local-env.sh

if [[ -z "$CI" ]]; then
  ./init-local.sh
else
  ./init-local.sh --skip-docker
fi

npm run dev:api-local

# This code is unreachable unless the api process exits on its own cleanly
if [[ -z "$CI" ]]; then
  echo "Stopping postgres, opensearch, cognito, and s3rver"
  if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
  else
    DOCKER_COMPOSE="docker compose"
  fi
  $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes 
  $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes
  pkill -f s3rver || true
  pkill -f cognito-local || true
fi
