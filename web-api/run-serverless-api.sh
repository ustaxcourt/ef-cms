#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "apiHandlers.js" "serverless-api.yml" "build:api"
