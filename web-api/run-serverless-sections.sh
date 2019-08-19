#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "sectionsHandlers.js" "serverless-sections.yml" "build:api:sections"
