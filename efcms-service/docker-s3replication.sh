#!/bin/bash -e
ENV=$1
docker build -t efcms-build -f ../Dockerfile.build ..
docker run -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" --rm efcms-build /bin/sh -c "cd efcms-service && ./setup-s3-replication.sh ${ENV}"