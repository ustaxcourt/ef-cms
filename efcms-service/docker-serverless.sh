#!/bin/bash -e
STAGE=$1
REGION=$2
docker build -t efcms-build -f ../Dockerfile.build ..
docker run -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" --rm efcms-build /bin/sh -c "cd efcms-service && ./run-serverless.sh ${STAGE} ${REGION}"