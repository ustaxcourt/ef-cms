#!/bin/bash -e
docker build -t cypress -f Dockerfile .
set +e
docker run --name "${CONTAINER_NAME}" -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop cypress /bin/sh -c 'cd web-api && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/api/swagger && cd ../web-client && (npm run dev:cypress &) && ../wait-until.sh http://localhost:1234 && npm run cypress'
CODE="$?"
set -e
mkdir -p cypress
docker cp "${CONTAINER_NAME}:/home/app/web-client/cypress/videos" cypress || true
docker cp "${CONTAINER_NAME}:/home/app/web-client/cypress/screenshots" cypress || true
docker rm "${CONTAINER_NAME}"
exit "${CODE}"