#!/bin/bash -e
docker build -t efcms-build -f ../Dockerfile ..
set +e
docker run --name "${CONTAINER_NAME}" efcms-build /bin/sh -c 'cd web-api && npm run test'
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/home/app/web-api/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"