#!/bin/bash

# Usage
#   used for running the API and necessary services (s3, elasticsearch) locally

# these exported values expire when script terminates
# shellcheck disable=SC1091
. ./setup-local-env.sh

export ELASTICSEARCH_HOST=elasticsearch
export ELASTICSEARCH_ENDPOINT=http://elasticsearch:9200
export POSTGRES_HOST=db

./scripts/setup-local-services.sh --skip-docker

nodemon -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress/ --exec "TS_NODE_TRANSPILE_ONLY=true node --inspect=0.0.0.0:9231 -r ts-node/register web-api/src/app-local.ts"

echo "API running..."
