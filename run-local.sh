#!/usr/bin/env bash
# Used for running the API and necessary services (s3, opensearch) locally

# shellcheck disable=SC1091

cleanup() {
  if [[ -z "$CI" ]]; then
    echo "Stopping postgres, opensearch, cognito, s3rver, and payment portal"
    if command -v docker-compose &> /dev/null; then
      DOCKER_COMPOSE="docker-compose"
    else
      DOCKER_COMPOSE="docker compose"
    fi
    $DOCKER_COMPOSE -f "$(pwd)/web-api/src/persistence/postgres/docker-compose.yml" down --volumes
    $DOCKER_COMPOSE -f "$(pwd)/web-api/elasticsearch/docker-compose.yml" down --volumes
    pkill -f s3rver || true
    pkill -f cognito-local || true
    npm run payment-portal stop
  fi
}

. ./setup-local-env.sh

INIT_LOCAL_ARGS=()
if [[ "$SKIP_PAYMENT_PORTAL" == "true" ]]; then
  INIT_LOCAL_ARGS+=(--skip-payment-portal)
fi
if [[ -n "$CI" ]]; then
  INIT_LOCAL_ARGS+=(--skip-docker)
fi

./init-local.sh "${INIT_LOCAL_ARGS[@]}"

trap cleanup EXIT

npm run dev:api-local
