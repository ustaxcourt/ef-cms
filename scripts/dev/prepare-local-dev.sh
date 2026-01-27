#!/bin/bash
# Extracted from run-local.sh - Prepares the environment for debugging

if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi

# shellcheck disable=SC1091
. ./setup-local-env.sh

echo "Starting postgres"
$DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" up -d

echo "Starting opensearch"
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" up -d

echo "Waiting for OpenSearch..."
URL=http://localhost:9200/ ./wait-until.sh

echo "Building assets"
npm run build:assets

echo "Seeding opensearch"
npm run seed:opensearch

echo "Preparing S3 storage"
mkdir -p ./web-api/storage/s3
rm -rf ./web-api/storage/s3/*

echo "Seeding S3"
# We don't start s3rver here because it's managed by the IDE run config
# But we can seed the directory
npm run seed:s3

echo "Running migrations and seeding Postgres"
npm run migration:postgres
npm run migration:postgres:contract
npm run seed:postgres

echo "Seeding cognito-local users"
npx ts-node .cognito/seedCognitoLocal.ts --transpile-only

echo "Cleaning up old service instances"
pkill -f s3rver || true
pkill -f cognito-local || true

echo "Starting s3rver in background"
npm run start:s3rver > /dev/null 2>&1 &
URL=http://0.0.0.0:9001/ ./wait-until.sh

echo "Starting cognito-local in background"
CODE="385030" npx cognito-local > /dev/null 2>&1 &
# Give cognito a moment to start
sleep 2

echo "Environment prepared and background services started!"
