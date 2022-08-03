#!/bin/bash

# Usage
#   used for running the API and necessary services (dynamo, s3, elasticsearch) locally

if [[ -z "$CIRCLECI" ]]; then
  echo "killing dynamo if already running"
  pkill -f DynamoDBLocal

  echo "starting dynamo"
  ./web-api/start-dynamo.sh &
  DYNAMO_PID=$!

  echo "killing elasticsearch if already running"
  pkill -f elasticsearch

  echo "starting elasticsearch"
  ./web-api/start-elasticsearch.sh &
  ESEARCH_PID=$!
fi

URL=http://localhost:8000/shell ./wait-until.sh
URL=http://localhost:9200/ ./wait-until.sh

npm run build:assets

# these exported values expire when script terminates
# shellcheck disable=SC1091
. ./setup-local-env.sh

echo "creating elasticsearch index"
npm run seed:elasticsearch

echo "killing s3rver if already running"
pkill -f s3rver

echo "starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &
S3RVER_PID=$!
URL=http://localhost:9000/ ./wait-until.sh
npm run seed:s3

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "creating & seeding dynamo tables"
  npm run seed:db
fi


if [[ -z "${RUN_DIR}" ]]; then
  RUN_DIR="src"
fi

node -r esm web-api/streams-local.js &
nodemon -e js --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration/ --ignore cypress-smoketests/ --ignore cypress-readonly --exec "node -r esm web-api/websockets-local.js" &
nodemon -e js --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration --ignore cypress-smoketests/ --ignore cypress-readonly --exec "node -r esm --inspect web-api/src/app-local.js" &
nodemon -e js --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration --ignore cypress-smoketests/ --ignore cypress-readonly --exec "node -r esm web-api/src/app-public-local.js"

if [ ! -e "$CIRCLECI" ]; then
  echo "killing dynamodb local"
  pkill -P $DYNAMO_PID
  pkill -P $ESEARCH_PID
fi

pkill -P $S3RVER_PID
