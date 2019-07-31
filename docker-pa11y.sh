#!/bin/bash -e
docker build -t pa11y -f Dockerfile .
docker run -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop --rm pa11y /bin/sh -c 'npm run install:dynamodb && (npm run start:api &) && ./wait-until.sh http://localhost:3000/api/swagger && (npm run start:client &) && ./wait-until.sh http://localhost:1234 && npm run test:pa11y'
