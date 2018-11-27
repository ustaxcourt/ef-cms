#!/bin/bash
STAGE=$1
REGION=$2
docker build -t efcms-build -f ../Dockerfile.build ..
docker run -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" -e AWS_PROFILE=FlexionUSTC -v ~/.aws:/root/.aws --rm efcms-build /bin/sh -c "cd efcms-service && ./run-serverless.sh ${STAGE} ${REGION}"