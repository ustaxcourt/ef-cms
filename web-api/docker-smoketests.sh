#!/bin/bash -e
slsStage=$1
region=$2
docker build -t efcms-build -f ../Dockerfile ..
docker run --rm efcms-build /bin/sh -c "cd web-api && ./run-smoketests.sh $slsStage $region"