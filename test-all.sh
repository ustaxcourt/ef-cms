#!/bin/bash -e

# This runs the same build steps that run in Circle, except sonar
rm -rf node_modules dist
yarn install
docker build -t efcms -f Dockerfile .
docker run --rm efcms /bin/sh -c 'yarn lint'
docker run --rm efcms /bin/sh -c './run-shellcheck.sh'
docker run -v "$(pwd)/shared/coverage:/home/app/shared/coverage" --rm efcms /bin/sh -c 'yarn test:shared'
docker run -v "$(pwd)/web-api/coverage:/home/app/web-api/coverage" --rm efcms /bin/sh -c 'yarn test:api'
docker run -v "$(pwd)/web-client/coverage:/home/app/web-client/coverage" --rm efcms /bin/sh -c \
  '(yarn start:api &) && ./wait-until.sh http://localhost:3000/api/swagger && yarn test:client'
docker run --rm -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:3000/api/swagger && ./wait-until.sh http://localhost:1234 && yarn test:pa11y'
docker run --rm -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:3000/api/swagger && ./wait-until.sh http://localhost:1234 && yarn cypress'
