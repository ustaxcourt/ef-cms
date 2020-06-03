#!/bin/bash -e

./web-api/run-serverless.sh "${1}" "${2}" "messagesHandlers.js" "serverless-messages.yml" "build:api:messages"
