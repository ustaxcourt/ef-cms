#!/bin/bash

# Usage
#   used for running the API and necessary services (dynamo, s3, elasticsearch) locally

npm run build:assets

# these exported values expire when script terminates
# shellcheck disable=SC1091
. ./setup-local-env.sh

export ELASTICSEARCH_HOST=elasticsearch
export DYNAMODB_ENDPOINT=http://dynamodb-local:8000

URL=http://elasticsearch:9200/ ./wait-until.sh

echo "creating elasticsearch index"
npm run seed:elasticsearch

echo "killing s3rver if already running"
pkill -f s3rver

echo "starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &
S3RVER_PID=$!
URL=http://0.0.0.0:9000/ ./wait-until.sh
npm run seed:s3


echo "$DYNAMODB_ENDPOINT - DYNAMODB_ENDPOINT"

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "creating & seeding dynamo tables"
  npm run seed:db
  exitCode=$?
fi

if [ "${exitCode}" != 0 ]; then                   
  echo "Failed to seed data!". 1>&2 && exit 1
fi


if [[ -z "${RUN_DIR}" ]]; then
  RUN_DIR="src"
fi

nodemon -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration/ --ignore cypress-smoketests/ --ignore cypress-readonly --exec "npx ts-node --transpile-only web-api/src/app-local.ts"

if [ ! -e "$CI" ]; then
  echo "killing dynamodb local"
  pkill -P "${DYNAMO_PID}"
  pkill -P "${ESEARCH_PID}"
fi

pkill -P $S3RVER_PID

echo "API running..."