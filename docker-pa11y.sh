#!/bin/bash -e
docker build -t web-client-build -f Dockerfile.web-client .
docker run --rm web-client-build /bin/sh -c 'cd efcms-service && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/v1/swagger && cd ../web-client && (npm run dev &) && ../wait-until.sh http://localhost:1234 && npm run test:pa11y'