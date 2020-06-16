#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "reportsHandlers.js" "serverless-reports.yml" "build:api:reports"
