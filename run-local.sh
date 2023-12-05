#!/bin/bash
# Used for running the API and necessary services (dynamo, s3, elasticsearch) locally

# shellcheck disable=SC1091
. ./setup-local-env.sh

if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb in case it's already running"
  pkill -f DynamoDBLocal

  echo "starting dynamo"
  ./web-api/start-dynamo.sh &
  DYNAMO_PID=$!

  echo "Stopping elasticsearch in case it's already running"
  pkill -f elasticsearch

  echo "Starting elasticsearch"
  ./web-api/start-elasticsearch.sh &
  ESEARCH_PID=$!
  URL=http://localhost:9200/ ./wait-until.sh

  echo "Stopping s3rver in case it's already running"
  pkill -f s3rver
fi

npm run build:assets

echo "Seeding elasticsearch"
npm run seed:elasticsearch

echo "Starting s3rver"
rm -rf ./web-api/storage/s3/*
npm run start:s3rver &
S3RVER_PID=$!
URL=http://0.0.0.0:9000/ ./wait-until.sh

npm run seed:s3

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "Creating & seeding dynamodb tables"
  npm run seed:db
  exitCode=$?

  if [ "${exitCode}" != 0 ]; then                   
    echo "Failed to seed data!". 1>&2 && exit 1
  fi
fi

if [ -n "${USE_COGNITO_LOCAL}" ]; then
  echo "Starting local lambda for cognito triggers"
  npm run start:cognito-triggers-local &
  echo "Starting cognito-local"
  CODE=123456 npx cognito-local &
fi

nodemon --delay 1 -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration/ --ignore cypress/helpers/ --ignore cypress-smoketests/ --ignore cypress-readonly --exec "npx ts-node --transpile-only web-api/src/app-local.ts"

if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb, elasticsearch, and s3rver"
  pkill -P "$DYNAMO_PID"
  pkill -P "$ESEARCH_PID"
  pkill -P "$S3RVER_PID"
fi