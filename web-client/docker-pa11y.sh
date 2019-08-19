#!/bin/bash -e
docker build -t web-client-build -f ../Dockerfile ..
docker run --rm web-client-build /bin/sh -c 'npx run-p start:api start:client:ci && ./wait-until.sh http://localhost:1234 && ./wait-until.sh http://localhost:3000 && sleep 5 && npm run test:pa11y'
