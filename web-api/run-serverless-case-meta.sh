#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "caseMetaHandlers.js" "serverless-case-meta.yml" "build:api:case:meta"
