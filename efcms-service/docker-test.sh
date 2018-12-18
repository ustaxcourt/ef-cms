#!/bin/bash -e
docker build -t efcms-build -f ../Dockerfile.build ..
set +e
docker run --name "${CONTAINER_NAME}" efcms-build /bin/sh -c 'cd efcms-service && npm run test'
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/home/app/efcms-service/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"