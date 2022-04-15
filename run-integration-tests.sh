#!/bin/bash

# this should only be ran from inside a container built from our `Dockerfile-integration`

echo "running npm ci... this may take a while"

npm ci

mkdir /tmp/web-client/

CI=true \
TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1 \
QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1 \
DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1 \
S3_ENDPOINT=http://localhost:9000 \
SKIP_CACHE_INVALIDATION=true \
AWS_ACCESS_KEY_ID=S3RVER \
AWS_SECRET_ACCESS_KEY=S3RVER \
npm run start:api:ci > /tmp/web-client/server-output.txt &
URL=http://localhost:4000/api/swagger ./wait-until.sh
URL=http://localhost:9200 ./wait-until.sh
URL=http://localhost:9000/ ./wait-until.sh
URL=http://localhost:8000/shell ./wait-until.sh
sleep 20 # figure out why we need to sleep here since we wait above ^

# these two tests have been the most intermittent in the last month after 9326 was merged into ustc/test
# noticeOfChangeOfAddressQCJourney failed 5 times from 3/22/22 - 4/14/22 on ustc/test
# noticeOfTrialSessionWithPaperService failed 9 times 3/22/22 - 4/14/22 on ustc/test
npm run test:file web-client/integration-tests/noticeOfChangeOfAddressQCJourney.test.js
# npm run test:file web-client/integration-tests/noticeOfTrialSessionWithPaperService.test.js

