#!/bin/bash -e
ENV=$1
REGIONS=$2
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --rm efcms-build /bin/sh -c "cd efcms-service && node setup-global-tables.js efcms-$ENV $REGIONS && node setup-global-tables.js efcms-documents-$ENV $REGIONS && node setup-global-tables.js efcms-cases-$ENV $REGIONS"