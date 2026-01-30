#!/bin/bash
# Extracted from run-local.sh - Prepares the environment for debugging

# Load environment variables
# shellcheck disable=SC1091
. ./setup-local-env.sh

# Ensure npm is in the path
if ! command -v npm &> /dev/null; then
  # shellcheck disable=SC1091
  [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" && nvm use --silent &> /dev/null || true
fi

if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi

echo "Stopping postgres in case it's already running"
$DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes || true

echo "Starting postgres"
$DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" up -d || { echo "Failed to start Postgres containers"; exit 1; }

echo "Waiting for Postgres..."
MAX_RETRIES=30
RETRY_COUNT=0
until docker exec dawson-db pg_isready -U postgres &> /dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
  ((RETRY_COUNT++))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Error: Postgres failed to start in time."
  exit 1
fi

echo "Stopping opensearch in case it's already running"
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes || true

echo "Starting opensearch"
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" up -d || { echo "Failed to start OpenSearch containers"; exit 1; }

echo "Waiting for OpenSearch..."
URL=http://localhost:9200/ ./wait-until.sh

echo "Building assets"
npm run build:assets

echo "Seeding opensearch"
npm run seed:opensearch

echo "Cleaning up old service instances"
pkill -f s3rver || true
pkill -f cognito-local || true

# Give the OS a moment to release ports
sleep 2

echo "Preparing S3 storage"
mkdir -p ./web-api/storage/s3
rm -rf ./web-api/storage/s3/*

echo "Starting background services (S3 and Cognito)"
nohup ./node_modules/.bin/s3rver -d web-api/storage/s3 -a 0.0.0.0 -p 9001 --configure-bucket noop-documents-local-us-east-1 web-api/cors-policy.xml --configure-bucket noop-temp-documents-local-us-east-1 web-api/cors-policy.xml > /dev/null 2>&1 < /dev/null &
nohup env HOST=0.0.0.0 CODE="385030" ./node_modules/.bin/cognito-local > /dev/null 2>&1 < /dev/null &

echo "Waiting for background services..."
# S3rver takes a moment to initialize the buckets
URL=http://0.0.0.0:9001/ ./wait-until.sh
URL=http://0.0.0.0:9229/ CHECK_CODE="404" ./wait-until.sh

# Extra safety buffer to ensure background processes are fully initialized
sleep 3

echo "Seeding S3"
npm run seed:s3

echo "Running migrations and seeding Postgres"
npm run migration:postgres
npm run migration:postgres:contract
npm run seed:postgres

echo "Seeding cognito-local users"
npx ts-node --transpile-only .cognito/seedCognitoLocal.ts

echo "Environment prepared!"
