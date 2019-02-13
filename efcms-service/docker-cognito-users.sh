#!/bin/bash -e
ENV=$1
docker build -t efcms-build -f ../Dockerfile.build ..
docker run -v ~/.aws:/root/.aws -e "AWS_PROFILE=FlexionUSTC" --rm efcms-build /bin/sh -c "cd efcms-service && ./setup-cognito-users.sh $ENV"
