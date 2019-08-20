#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "workItemsHandlers.js" "serverless-work-items.yml" "build:api:workItems"
