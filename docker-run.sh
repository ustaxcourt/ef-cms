#!/bin/bash -e
docker build -t run -f Dockerfile.run .
(./wait-until.sh http://localhost:1234 && echo 'Build successful. You can access the site at http://localhost:1234/log-in') &
docker run -t -i -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop -p 1234:1234 -p 3000:3000 -p 8000:8000 -p 8001:8001 -p 9000:9000 --rm run /bin/sh -c "cd efcms-service && npm run install:dynamodb && (npm start &) && (npm run dynamo:admin &) && cd ../web-client && npm start"