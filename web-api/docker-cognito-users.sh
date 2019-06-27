#!/bin/bash -e
ENV=$1
docker build -t efcms-build -f ../Dockerfile ..
docker run -e "USTC_ADMIN_PASS=${USTC_ADMIN_PASS}" --rm efcms-build /bin/sh -c "cd web-api && ./setup-cognito-users.sh $ENV"
