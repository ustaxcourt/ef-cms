#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "notificationHandlers.js" "serverless-notifications.yml" "build:api:notifications"
