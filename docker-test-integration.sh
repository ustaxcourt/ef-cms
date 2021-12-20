#!/bin/bash -e

docker build -t efcms -f Dockerfile .

docker run -v "$(pwd)/web-client/coverage:/home/app/web-client/coverage" --rm efcms /bin/sh -c \
  '(npm run start:api:ci &) && URL=http://localhost:4000/api/swagger ./wait-until.sh && npm run test:client:integration'
