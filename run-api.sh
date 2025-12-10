#!/bin/bash

# Usage
#   used for running the API and necessary services (s3, elasticsearch) locally

npm run build:assets

# these exported values expire when script terminates
# shellcheck disable=SC1091
. ./setup-local-env.sh

export ELASTICSEARCH_HOST=elasticsearch

URL=http://elasticsearch:9200/ ./wait-until.sh

echo "creating elasticsearch index"
npm run seed:elasticsearch

echo "killing s3rver if already running"
pkill -f s3rver

echo "starting s3rver"
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

if [[ -z "${RUN_DIR}" ]]; then
  RUN_DIR="src"
fi

nodemon -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore local-only/ --ignore deployed-and-local/ --ignore readonly --exec "npx ts-node --transpile-only web-api/src/app-local.ts"

if [ ! -e "$CI" ]; then
  echo "killing opensearch"
  pkill -P "${ESEARCH_PID}"
fi

pkill -P $S3RVER_PID

echo "API running..."
