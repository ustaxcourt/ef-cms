#!/bin/bash -e
docker build -t efcms -f Dockerfile .
docker run -t -i \
  -e AWS_ACCESS_KEY_ID=noop \
  -e AWS_SECRET_ACCESS_KEY=noop \
  -p 1234:1234 \
  -p 3000:3000 \
  -p 8000:8000 \
  -p 8001:8001 \
  -p 9000:9000 \
  --rm efcms /bin/sh \
  -c "(npm run start:api &) && (npm run dynamo:admin &) && (npm run print:success &) && npm run start:client"
