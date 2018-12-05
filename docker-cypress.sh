#!/bin/bash -e
docker build -t cypress -f Dockerfile.web-client .
set +e
docker run --name "${CONTAINER_NAME}" -v ~/.npm:/.npm -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop --rm cypress /bin/sh -c 'cd efcms-service && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/v1/swagger && cd ../web-client && (npm run dev &) && ../wait-until.sh http://localhost:1234 && npm run cypress'
CODE="$?"
set -e
docker cp "${CONTAINER_NAME}:/home/app/web-client/cypress/screenshots" web-client/cypress/screenshots
docker cp "${CONTAINER_NAME}:/home/app/web-client/cypress/videos" web-client/cypress/videos
docker rm "${CONTAINER_NAME}"
exit "${CODE}"