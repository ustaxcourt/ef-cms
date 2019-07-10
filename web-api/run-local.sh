#!/bin/bash
echo "killing dynamo if already running"
pgrep -f DynamoDBLocal | xargs kill

echo "starting dynamo"
./start-dynamo.sh &
DYNAMO_PID=$!

node start-s3rver &
S3RVER_PID=$!

echo "seeding s3"
mkdir -p storage/s3/noop-documents-local-us-east-1
rm -rf storage/s3/noop-documents-local-us-east-1 && cp -R storage/fixtures/s3/ storage/s3/noop-documents-local-us-east-1

echo "creating dynamo tables"
node create-dynamo-tables.js

echo "seeding dynamo"
node seed-dynamo.js

echo "starting api service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config serverless.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &
echo "starting cases service"
SKIP_SANITIZE=true SKIP_VIRUS_SCAN=true AWS_ACCESS_KEY_ID=noop AWS_SECRET_ACCESS_KEY=noop SLS_DEPLOYMENT_BUCKET=noop ./node_modules/.bin/sls offline start --config serverless-cases.yml --noTimeout --stage local --region us-east-1 --domain noop --efcmsTableName=efcms-local --accountId noop &

echo "starting proxy"
node proxy.js

pkill -P $DYNAMO_PID
kill $S3RVER_PID
