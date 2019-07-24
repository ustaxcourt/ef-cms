#!/bin/bash
CONTAINER_NAME="dockerzap"
set +e
docker run --name "${CONTAINER_NAME}" -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-weekly zap-api-scan.py -t https://efcms-dev.ustc-case-mgmt.flexion.us/api/swagger.json -f openapi -d -g gen.conf -r zap-report.html -z "-configfile /zap/wrk/options.prop"
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/zap/wrk/zap-report.html" docs/zap-report.html
docker rm "${CONTAINER_NAME}"
exit "${CODE}"