#!/bin/bash
echo "killing dynamo if already running"
pgrep -f DynamoDBLocal | xargs kill

echo "starting dynamo"
./web-api/start-dynamo.sh &
DYNAMO_PID=$!

node web-api/start-s3rver &
S3RVER_PID=$!

echo "seeding s3"
cd web-api/storage || exit
# clobber S3 and re-init from fixtures
rm -rf s3/noop-documents-local-us-east-1
mkdir -p s3/noop-documents-local-us-east-1
cp -R fixtures/s3/ s3/noop-documents-local-us-east-1
cd ../.. || exit

echo "creating dynamo tables"
node web-api/create-dynamo-tables.js

echo "seeding dynamo"
node web-api/seed-dynamo.js

# these exported values expire when script terminates
export SKIP_SANITIZE=true
export SKIP_VIRUS_SCAN=true
export AWS_ACCESS_KEY_ID=noop
export AWS_SECRET_ACCESS_KEY=noop
export SLS_DEPLOYMENT_BUCKET=noop 

# set common arguments used by sls below (appearing as "$@")
set -- --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop 

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
node web-api/proxy.js

pkill -P $DYNAMO_PID
kill $S3RVER_PID
