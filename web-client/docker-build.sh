#!/bin/bash -e
ENV=$1
API_URL="https://efcms-${ENV}.${EFCMS_DOMAIN}/v1"
docker build -t web-client-build -f ../Dockerfile.web-client ..
docker run --name "${CONTAINER_NAME}" web-client-build /bin/sh -c "cd web-client && API_URL=${API_URL} npm run dist"
CODE="$?"
docker cp "${CONTAINER_NAME}:/home/app/web-client/dist" dist
docker rm "${CONTAINER_NAME}"
exit "${CODE}"