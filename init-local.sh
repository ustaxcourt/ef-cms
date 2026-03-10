#!/bin/bash

set -e

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  # shellcheck disable=SC1091
  . ./setup-local-env.sh
fi

if ! command -v npm &> /dev/null; then
  # shellcheck disable=SC1091
  [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" && nvm use --silent &> /dev/null || true
fi

IN_DOCKER=false
if [ -f /.dockerenv ] || [ -f /run/.containerenv ] || [ "$POSTGRES_HOST" = "db" ]; then
  IN_DOCKER=true
fi

if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi

SKIP_DOCKER=false
BACKGROUND=false
SKIP_ASSETS=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --skip-docker) SKIP_DOCKER=true ;;
    --background) BACKGROUND=true ;;
    --skip-assets) SKIP_ASSETS=true ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

if [ -z "$POSTGRES_HOST" ]; then
  if [ "$IN_DOCKER" = "true" ]; then
    export POSTGRES_HOST="db"
  else
    export POSTGRES_HOST="localhost"
  fi
fi

if [ -z "$ELASTICSEARCH_HOST" ]; then
  if [ "$IN_DOCKER" = "true" ]; then
    export ELASTICSEARCH_HOST="elasticsearch"
    export ELASTICSEARCH_ENDPOINT="${ELASTICSEARCH_ENDPOINT:-http://elasticsearch:9200}"
  else
    export ELASTICSEARCH_HOST="localhost"
    export ELASTICSEARCH_ENDPOINT="${ELASTICSEARCH_ENDPOINT:-http://localhost:9200}"
  fi
fi

wait_for_opensearch() {
  echo "Waiting for OpenSearch..."
  local os_url=${ELASTICSEARCH_ENDPOINT:-http://localhost:9200}
  URL="${os_url}/" ./wait-until.sh
}

wait_for_postgres() {
  echo "Waiting for Postgres..."
  local host="${POSTGRES_HOST}"
  local user="${POSTGRES_USER:-postgres}"
  local port="${POSTGRES_PORT:-5432}"

  if [ -n "$CI" ]; then
    until (echo > "/dev/tcp/${host}/${port}") > /dev/null 2>&1; do
      echo "Postgres is unavailable - sleeping"
      sleep 2
    done
  elif [ "$host" != "localhost" ] || [ "$IN_DOCKER" = "true" ]; then
    until pg_isready -h "$host" -p "$port" -U "$user" &> /dev/null; do
      echo "Postgres is unavailable - sleeping"
      sleep 1
    done
  else
    until docker exec dawson-db pg_isready -U "$user" &> /dev/null; do
      echo "Postgres is unavailable - sleeping"
      sleep 2
    done
  fi
}

start_docker_dependencies() {
  if [ "$SKIP_DOCKER" = "true" ]; then
    return
  fi

  if [ -n "${RESUME}" ]; then
    echo "Resuming: keeping existing docker volumes"
  else
    echo "Stopping any existing local docker services..."
    $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes || true
    $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes || true

    # ensure the container names are not in use
    docker rm -f shell api client public dawson-db opensearch-node &> /dev/null || true
  fi

  echo "Starting postgres"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" up -d || { echo "Failed to start Postgres containers"; exit 1; }

  echo "Starting opensearch"
  $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" up -d || { echo "Failed to start OpenSearch containers"; exit 1; }

  wait_for_opensearch
  wait_for_postgres
}

setup_opensearch() {
  echo "Seeding opensearch"
  npm run seed:opensearch
}

setup_s3() {
  echo "Cleaning up old s3rver instance"
  pkill -f s3rver || true
  # Give the OS a moment to release ports
  sleep 2

  if [ -n "${RESUME}" ]; then
    echo "Resuming operation with previous s3 data"
  else
    rm -rf ./web-api/storage/s3/*
    mkdir -p ./web-api/storage/s3
  fi

  echo "Starting s3rver"
  if [ "$BACKGROUND" = "true" ]; then
    nohup npm run start:s3rver > /dev/null 2>&1 < /dev/null &
  else
    npm run start:s3rver &
  fi

  URL=http://localhost:9001/ ./wait-until.sh
  sleep 2

  if [ -z "${RESUME}" ]; then
    npm run seed:s3
  fi
}

setup_postgres() {
  if [ -n "${RESUME}" ]; then
    echo "Resuming: running only migrations (skipping seed)"
    npm run migration:postgres
    npm run migration:postgres:contract
  else
    echo "Running migrations and seeding Postgres"
    npm run migration:postgres
    npm run migration:postgres:contract
    npm run seed:postgres
  fi
}

setup_cognito() {
  echo "Cleaning up old cognito-local instance"
  pkill -f cognito-local || true
  # Give the OS a moment to release ports
  sleep 2

  echo "Seeding cognito-local users"
  npx ts-node --transpile-only .cognito/seedCognitoLocal.ts

  echo "Starting cognito-local"
  if [ "$BACKGROUND" = "true" ]; then
    nohup env HOST=0.0.0.0 CODE="385030" npx cognito-local > /dev/null 2>&1 < /dev/null &
  else
    HOST=0.0.0.0 CODE="385030" npx cognito-local &
  fi

  URL=http://localhost:9229/ CHECK_CODE="404" ./wait-until.sh
}

if [ "$SKIP_ASSETS" = "false" ]; then
  npm run build:assets
fi

start_docker_dependencies
wait_for_opensearch
wait_for_postgres
setup_opensearch
setup_s3
setup_postgres
setup_cognito

echo "Environment prepared!"
