#!/bin/bash -e
docker build -t main-build -f Dockerfile.main .
docker run main-build /bin/sh -c "cd efcms-service && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/v1/swagger && cd ../web-client && npm run test"