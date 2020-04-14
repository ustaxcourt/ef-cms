#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "caseDocumentsHandlers.js" "serverless-case-documents.yml" "build:api:case:documents"
