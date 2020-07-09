#!/bin/bash -e

# This runs the same build steps that run in Circle, except sonar
rm -rf node_modules dist .elasticsearch .dynamodb
npm ci

docker build -t efcms -f Dockerfile .

docker run --rm efcms /bin/sh -c 'npm run lint'

docker run --rm efcms /bin/sh -c './run-shellcheck.sh'

docker run -v "$(pwd)/shared/coverage:/home/app/shared/coverage" --rm efcms /bin/sh -c 'npm run test:shared'

docker run -v "$(pwd)/web-api/coverage:/home/app/web-api/coverage" --rm efcms /bin/sh -c 'npm run test:api'

docker run -v "$(pwd)/web-client/coverage:/home/app/web-client/coverage" --rm -e SKIP_CACHE_INVALIDATION=true efcms /bin/sh -c \
  '(npm run start:api &) && ./wait-until.sh http://localhost:4000/api/swagger && npm run test:client'

docker run --rm -e SKIP_CACHE_INVALIDATION=true -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:4000/api/swagger && ./wait-until.sh http://localhost:1234 && npm run test:pa11y'

docker run --rm -e SKIP_CACHE_INVALIDATION=true -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:4000/api/swagger && ./wait-until.sh http://localhost:1234 && npm run cypress'
