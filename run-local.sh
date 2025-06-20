#!/bin/bash
# Used for running the API and necessary services (dynamo, s3, elasticsearch) locally

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

  echo "Stopping dynamodb in case it's already running"
  pkill -f DynamoDBLocal

  echo "starting dynamo"
  ./web-api/start-dynamo.sh &
  DYNAMO_PID=$!

  echo "Stopping elasticsearch in case it's already running"
  pkill -f elasticsearch

  echo "Starting elasticsearch"
  ./web-api/start-elasticsearch.sh &
  ESEARCH_PID=$!
  URL=http://localhost:9200/ ./wait-until.sh

  echo "Stopping s3rver in case it's already running"
  pkill -f s3rver
fi

npm run build:assets

echo "Seeding elasticsearch"
npm run seed:elasticsearch

echo "Starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &
S3RVER_PID=$!
URL=http://0.0.0.0:9001/ ./wait-until.sh

npm run seed:s3

npm run migration:postgres

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "Creating & seeding dynamodb tables"
  npm run seed:db
  exitCode=$?

  if [ "${exitCode}" != 0 ]; then                   
    echo "Failed to seed data!". 1>&2 && exit 1
  fi
fi

npm run seed:postgres

echo "Seeding cognito-local users"
npx ts-node .cognito/seedCognitoLocal.ts --transpile-only

echo "Starting cognito-local"
CODE="385030" npx cognito-local &
COGNITO_PID=$!

if [[ -z "$USTC_DEBUG" ]]; then
  npm run dev:api-local
else
  npm run dev:api-local-debug
fi


if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb, elasticsearch, and s3rver"
  pkill -P "$DYNAMO_PID"
  pkill -P "$ESEARCH_PID"
  pkill -P "$S3RVER_PID"
  pkill -P "$COGNITO_PID"
fi
