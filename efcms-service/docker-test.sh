#!/bin/bash
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --name "${CONTAINER_NAME}" efcms-build /bin/sh -exc 'cd efcms-service && npm run test'
docker cp "${CONTAINER_NAME}:/home/app/efcms-service/coverage" coverage
docker rm "${CONTAINER_NAME}"