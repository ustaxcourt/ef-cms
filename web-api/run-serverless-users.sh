#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "usersHandlers.js" "serverless-users.yml" "build:api:users"
