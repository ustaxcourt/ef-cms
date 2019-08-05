#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "documentsHandlers.js" "serverless-documents.yml" "build:api:documents"
