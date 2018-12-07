#!/bin/bash -e
slsStage=$1
region=$2
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --rm efcms-build /bin/sh -c "cd efcms-service && ./run-smoketests.sh $slsStage $region"