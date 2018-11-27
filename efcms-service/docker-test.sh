#!/bin/bash
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --name "${CONTAINER_NAME}" efcms-build /bin/sh -c 'cd efcms-service && npm run test'
CODE="$?"
docker cp "${CONTAINER_NAME}:/home/app/efcms-service/coverage" coverage
docker rm "${CONTAINER_NAME}"
exit "${CODE}"