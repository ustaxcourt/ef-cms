#!/bin/bash -e
STAGE=$1
REGION=$2
docker build -t efcms-build -f ../Dockerfile ..
docker run -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" --rm efcms-build /bin/sh -c "cd shared && rm -rf node_modules && npm i --only=production && cd ../web-api && ./run-serverless.sh ${STAGE} ${REGION}"