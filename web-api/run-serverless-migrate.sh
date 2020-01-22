#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "migrateHandlers.js" "serverless-migrate.yml" "build:api:migrate"
