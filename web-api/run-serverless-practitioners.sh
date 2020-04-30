#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "practitionersHandlers.js" "serverless-practitioners.yml" "build:api:practitioners"
