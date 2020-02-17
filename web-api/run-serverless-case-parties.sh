#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "casePartiesHandlers.js" "serverless-case-parties.yml" "build:api:case:parties"
