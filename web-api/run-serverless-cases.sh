#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "casesHandlers.js" "serverless-cases.yml" "build:api:cases"
