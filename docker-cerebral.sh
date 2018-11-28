#!/bin/bash -e
docker build -t main-build -f Dockerfile.main .
docker run main-build /bin/sh -c "cd efcms-service && npm run install:dynamodb && (npm start &) && sleep 5 && cd ../web-client && npm run test"