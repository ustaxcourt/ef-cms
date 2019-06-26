#!/bin/bash -e
ENV=$1
docker build -t efcms-build -f ../Dockerfile ..
docker run -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" --rm efcms-build /bin/sh -c "cd web-api && ./setup-regional-route53.sh ${ENV}"