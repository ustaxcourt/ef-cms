#!/bin/bash
echo "killing dynamo if already running"
pkill -f DynamoDBLocal

if [ -e $CI ] then
echo "starting dynamo"
  ./web-api/start-dynamo.sh &
  DYNAMO_PID=$!
fi

node ./web-api/start-s3rver &
S3RVER_PID=$!

echo "seeding s3"
npm run seed:s3

echo "creating & seeding dynamo tables"
npm run seed:db

# these exported values expire when script terminates
export SKIP_SANITIZE=true
export SKIP_VIRUS_SCAN=true
export AWS_ACCESS_KEY_ID=noop
export AWS_SECRET_ACCESS_KEY=noop
export SLS_DEPLOYMENT_BUCKET=noop

# set common arguments used by sls below (appearing as "$@")
set -- \
  --accountId noop \
  --domain noop \
  --efcmsTableName=efcms-local \
  --noAuth \
  --noTimeout \
  --region us-east-1 \
  --stage local

echo "starting api service"
npx sls offline start "$@" --config web-api/serverless-api.yml &
echo "starting cases service"
npx sls offline start "$@" --config web-api/serverless-cases.yml &
echo "starting users service"
npx sls offline start "$@" --config web-api/serverless-users.yml &
echo "starting documents service"
npx sls offline start "$@" --config web-api/serverless-documents.yml &
echo "starting work items service"
npx sls offline start "$@" --config web-api/serverless-work-items.yml &
echo "starting sections service"
npx sls offline start "$@" --config web-api/serverless-sections.yml &
echo "starting trial session service"
npx sls offline start "$@" --config web-api/serverless-trial-sessions.yml &

echo "starting proxy"
node ./web-api/proxy.js

if [ -e $DYNAMO_PID ] then
  pkill -P $DYNAMO_PID
fi

kill $S3RVER_PID
