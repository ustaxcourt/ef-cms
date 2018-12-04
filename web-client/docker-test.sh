#!/bin/bash -e
docker build -t web-client-build -f ../Dockerfile.build ..
set +e
docker run --name "${CONTAINER_NAME}" web-client-build /bin/sh -c 'cd web-client && npm run test'
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/home/app/web-client/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"