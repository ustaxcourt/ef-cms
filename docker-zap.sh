#!/bin/bash
CONTAINER_NAME="dockerzap"
set +e
docker rm "${CONTAINER_NAME}"
docker run --name "${CONTAINER_NAME}" -v "$(pwd)":/zap/wrk/:rw -t owasp/zap2docker-weekly zap-api-scan.py -t https://efcms-api-dev.ustc-case-mgmt.flexion.us/api/swagger.json -f openapi -d -g gen.conf -r zap-report.html -z "-configfile /zap/wrk/options.prop"
CODE="$?"
set -e
mv "${CONTAINER_NAME}:/zap/wrk/zap-report.html" docs/zap-report.html
docker rm "${CONTAINER_NAME}"
exit "${CODE}"
