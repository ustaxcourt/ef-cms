#!/bin/bash -e

docker build -t efcms -f Dockerfile-local .

docker run -m 4g --cpus=2 -v "$(pwd)/web-client/coverage:/home/app/web-client/coverage" --rm efcms /bin/sh -c \
  '(npm run start:api:ci &) && ./wait-until.sh http://localhost:4000/api/swagger  && ./wait-until.sh http://localhost:5000/ 404 && (npx run-p start:client:ci start:public:ci &) && ./wait-until.sh http://localhost:1234/ && ./wait-until.sh http://localhost:5678 && npm run test:pa11y --prefix=web-client/pa11y/'
