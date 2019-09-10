#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "caseDeadlinesHandlers.js" "serverless-case-deadlines.yml" "build:api:case:deadlines"
