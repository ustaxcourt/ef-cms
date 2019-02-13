#!/bin/bash -e
ENV=$1
docker build -t web-client-build -f ../Dockerfile.web-client ..
docker run -e "API_URL=${API_URL}" --name "${CONTAINER_NAME}" web-client-build /bin/sh -c "cd web-client && ./build-dist.sh $ENV"
CODE="$?"
docker cp "${CONTAINER_NAME}:/home/app/web-client/dist" dist
docker rm "${CONTAINER_NAME}"
exit "${CODE}"