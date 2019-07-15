#!/bin/bash -e
docker build -t pa11y -f Dockerfile .
docker run -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop --rm pa11y /bin/sh -c 'cd web-api && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/api/swagger && cd ../web-client && (npm run dev &) && ../wait-until.sh http://localhost:1234 && npm run test:pa11y'