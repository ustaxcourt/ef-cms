#!/usr/bin/env bash

# Usage
#   used for running the API and necessary services (s3, elasticsearch) locally

# these exported values expire when script terminates
# shellcheck disable=SC1091
. ./setup-local-env.sh

export ELASTICSEARCH_HOST=elasticsearch
export ELASTICSEARCH_ENDPOINT=http://elasticsearch:9200
export POSTGRES_HOST=db

./init-local.sh --skip-docker

INSPECT_FLAG=""
if [[ -n "$IDE_DEBUGGING" ]]; then
  INSPECT_FLAG="--inspect=0.0.0.0:9231"
fi

nodemon -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress/ --exec "TS_NODE_TRANSPILE_ONLY=true node $INSPECT_FLAG -r ts-node/register web-api/src/app-local.ts"

echo "API running..."
