#!/bin/bash -e

# This runs the same build steps that run in Circle
npm i
npm i --prefix=web-client/pa11y/

docker build -t efcms -f Dockerfile-local .

docker run --rm efcms /bin/sh -c 'npm run lint'

docker run --rm efcms /bin/sh -c './run-shellcheck.sh'

docker run -v "$(pwd)/shared/coverage:/home/app/shared/coverage" --rm efcms /bin/sh -c 'npm run test:shared:ci'

docker run -v "$(pwd)/shared/coverage:/home/app/shared/coverage" --rm efcms /bin/sh -c 'npm run test:client:unit:ci'

docker run -v "$(pwd)/web-api/coverage:/home/app/web-api/coverage" --rm efcms /bin/sh -c 'npm run test:api:ci'

docker run -v "$(pwd)/web-client/coverage:/home/app/web-client/coverage" --rm efcms /bin/sh -c \
  '(npm run start:api &) && ./wait-until.sh http://localhost:4000/api/swagger && npm run test:client:integration'

docker run --rm -e AWS_ACCESS_KEY_ID=S3RVER -e AWS_SECRET_ACCESS_KEY=S3RVER efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:4000/api/swagger && ./wait-until.sh http://localhost:1234 && npm run test:pa11y --prefix=web-client/pa11y/'

docker run --rm -e AWS_ACCESS_KEY_ID=S3RVER -e AWS_SECRET_ACCESS_KEY=S3RVER efcms /bin/sh -c \
  '(npx run-p start:api start:client:ci &) && ./wait-until.sh http://localhost:4000/api/swagger && ./wait-until.sh http://localhost:1234 && npm run cypress'
