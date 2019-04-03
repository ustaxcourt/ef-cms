#!/bin/bash -e
ENV=$1
docker build -t efcms-build -f ../Dockerfile ..
docker run --rm efcms-build /bin/sh -c "cd efcms-service && ./setup-cognito-ui.sh $ENV"
