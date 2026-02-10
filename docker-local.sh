#!/bin/bash -e

export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Determine the docker compose invocation.
if command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  DOCKER_COMPOSE="docker compose"
fi

current_uid=$(id -u)
current_gid=$(id -g)
export CURRENT_UID="$current_uid"
export CURRENT_GID="$current_gid"

DESTINATION_TAG=$(grep 'docker-image:' .circleci/config.yml | awk -F':' '{print $3}')
LOCAL_IMAGE_NAME="efcms-local:${DESTINATION_TAG}"

$DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes || true
$DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes || true

docker rm -f shell api client public dawson-db opensearch-node &> /dev/null || true

pkill -f s3rver || true
pkill -f cognito-local || true

docker build --platform=linux/amd64 -t "$LOCAL_IMAGE_NAME" -t "efcms-local:latest" -f Dockerfile .
if [[ -z "$IDE_DEBUGGING" ]]; then
  $DOCKER_COMPOSE up --build
else
  $DOCKER_COMPOSE up --build -d

  $DOCKER_COMPOSE logs -f api &
  LOGS_PID=$!
  trap 'kill $LOGS_PID 2>/dev/null || true' EXIT

  MAX_TRIES=300 URL="http://localhost:9231/json" NO_REMINDERS="true" ./wait-until.sh

  echo "Debugger port is open. Waiting 3 seconds for the Node.js inspector to stabilize..."
  sleep 3
fi
