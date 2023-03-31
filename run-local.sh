#!/bin/bash
# Used for running the API and necessary services (dynamo, s3, elasticsearch) locally

export ELASTICSEARCH_HOST=localhost
export ELASTICSEARCH_ENDPOINT=http://localhost:9200
export DYNAMODB_ENDPOINT=http://localhost:8000

if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb in case it's already running"
  pkill -f DynamoDBLocal

  echo "starting dynamo"
  ./web-api/start-dynamo.sh &

  echo "Stopping elasticsearch in case it's already running"
  pkill -f elasticsearch

  echo "Starting elasticsearch"
  ./web-api/start-elasticsearch.sh &
  URL=http://localhost:9200/ ./wait-until.sh
fi

npm run build:assets

# shellcheck disable=SC1091
. ./setup-local-env.sh

echo "Seeding elasticsearch"
npm run seed:elasticsearch

echo "Stopping s3rver in case it's already running"
pkill -f s3rver

echo "Starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &

URL=http://localhost:9000/ ./wait-until.sh
npm run seed:s3

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "Creating & seeding dynamodb tables"
  npm run seed:db
  exitCode=$?
fi

if [ "${exitCode}" != 0 ]; then                   
  echo "Seed data is invalid!". 1>&2 && exit 1
fi

nodemon --delay 1 -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration/ --ignore cypress-smoketests/ --ignore cypress-readonly --exec "npx ts-node --transpile-only web-api/src/app-local.ts"