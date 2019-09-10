#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "caseNotesHandlers.js" "serverless-case-notes.yml" "build:api:case:notes"
