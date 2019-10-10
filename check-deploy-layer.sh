#!/bin/bash

RUNTIME=$1          # ex: ghostscript, puppeteer
COMPARE_BRANCH=$2   # ex: develop, staging
ENV=$3              # ex: stg, dev, exp
REGION=$4           # ex: us-east-1, us-west-1

if (git diff --name-only origin/${COMPARE_BRANCH} | grep -q "runtimes/${RUNTIME}"); then
  cd ./web-api/runtimes/${RUNTIME}
  ./build.sh
  cd ../../..
  ./web-api/run-serverless-${RUNTIME}.sh ${ENV} ${REGION}
fi