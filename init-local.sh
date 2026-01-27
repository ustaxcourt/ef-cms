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

echo "Waiting for Postgres..."
until docker exec dawson-db pg_isready -U postgres; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Starting opensearch"
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" up -d

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
# Using nohup and redirection to ensure services stay alive after the script exits
# We use /dev/null for stdin to fully detach
nohup ./node_modules/.bin/s3rver -d web-api/storage/s3 -a 0.0.0.0 -p 9001 --configure-bucket noop-documents-local-us-east-1 web-api/cors-policy.xml --configure-bucket noop-temp-documents-local-us-east-1 web-api/cors-policy.xml > /dev/null 2>&1 < /dev/null &
nohup env HOST=0.0.0.0 PORT=9229 CODE="385030" ./node_modules/.bin/cognito-local > /dev/null 2>&1 < /dev/null &

echo "Waiting for background services..."
# S3rver takes a moment to initialize the buckets
URL=http://localhost:9001/noop-documents-local-us-east-1 ./wait-until.sh
URL=http://localhost:9229/ CHECK_CODE="404" ./wait-until.sh

# Extra safety buffer to ensure background processes are fully initialized
sleep 3

echo "Seeding S3"
for _ in {1..3}; do
  if npm run seed:s3; then break; else echo "S3 seeding failed, retrying in 2s..." && sleep 2; fi
done

echo "Running migrations and seeding Postgres"
npm run migration:postgres
npm run migration:postgres:contract

for _ in {1..3}; do
  if npm run seed:postgres; then break; else echo "Postgres seeding failed, retrying in 2s..." && sleep 2; fi
done

echo "Seeding cognito-local users"
for _ in {1..3}; do
  if HOST=localhost PORT=9229 npx ts-node .cognito/seedCognitoLocal.ts --transpile-only; then break; else echo "Cognito seeding failed, retrying in 2s..." && sleep 2; fi
done

# Kill the background services after seeding so that the API can start them itself and they stay in its process group
echo "Seeding completed, stopping temporary background services..."
pkill -f s3rver || true
pkill -f cognito-local || true

echo "Environment prepared!"
