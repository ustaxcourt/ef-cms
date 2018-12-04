#!/bin/bash -e
docker build -t shared-build -f ../Dockerfile.shared ..
set +e
docker run --name "${CONTAINER_NAME}" shared-build /bin/sh -c 'cd shared && npm run test'
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/home/app/shared/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"