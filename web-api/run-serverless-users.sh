#!/bin/bash -e
./run-serverless.sh "${1}" "${2}" "usersHandlers.js" "serverless-users.yml" "build:users"
