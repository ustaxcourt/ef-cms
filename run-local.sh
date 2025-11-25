#!/bin/bash
# Used for running the API and necessary services (s3, opensearch) locally

# Determine the docker compose invocation.
if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi
# shellcheck disable=SC1091
. ./setup-local-env.sh

if [[ -z "$CI" ]]; then
  echo "Stopping postgres in case it's already running"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes || true

  echo "Starting postgres"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" up -d || { echo "Failed to start Postgres containers"; exit 1; }

  echo "Stopping opensearch in case it's already running"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes || true

  echo "Starting opensearch"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" up -d || { echo "Failed to start OpenSearch containers"; exit 1; }
  
  echo "OpenSearch is running"

  URL=http://localhost:9200/ ./wait-until.sh

  echo "Stopping s3rver in case it's already running"
  pkill -f s3rver
fi

npm run build:assets

  echo "Seeding opensearch"
npm run seed:opensearch

echo "Starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &
S3RVER_PID=$!
URL=http://0.0.0.0:9001/ ./wait-until.sh

npm run seed:s3

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 data"
fi

npm run migration:postgres
npm run migration:postgres:contract

npm run seed:postgres

echo "Seeding cognito-local users"
npx ts-node .cognito/seedCognitoLocal.ts --transpile-only

echo "Starting cognito-local"
CODE="385030" npx cognito-local &
COGNITO_PID=$!
 
npm run dev:api-local

# This code is unreachable unless the api process exits on its own cleanly
if [[ -z "$CI" ]]; then
  echo "Stopping postgres, opensearch, cognito, and s3rver"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes 
  $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes
  pkill -P "$S3RVER_PID"
  pkill -P "$COGNITO_PID"
fi
