#!/bin/bash -e
docker build -t web-client-build -f Dockerfile.web-client .
docker run -v ~/.npm:/.npm -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop web-client-build /bin/sh -c "cd efcms-service && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/v1/swagger && cd ../web-client && npm run test"