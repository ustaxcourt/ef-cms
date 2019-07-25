#!/bin/bash -e
./run-serverless.sh "${1}" "${2}" "workItemsHandlers.js" "serverless-work-items.yml" "build:workItems"
