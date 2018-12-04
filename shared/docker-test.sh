#!/bin/bash -e
docker build -t shared-build -f ../Dockerfile.shared ..
docker run --name "${CONTAINER_NAME}" shared-build /bin/sh -c 'cd shared && npm run test'
CODE="$?"
docker cp "${CONTAINER_NAME}:/home/app/shared/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"