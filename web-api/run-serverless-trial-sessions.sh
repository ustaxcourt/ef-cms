#!/bin/bash -e
./web-api/run-serverless.sh "${1}" "${2}" "trialSessionsHandlers.js" "serverless-trial-sessions.yml" "build:api:trialSessions"
