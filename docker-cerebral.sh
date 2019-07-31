#!/bin/bash -e
docker build -t cerebral -f Dockerfile .
docker run -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop cerebral /bin/sh -c "(npm run start:api &) && ./wait-until.sh http://localhost:3000/api/swagger && sleep 10; npm run test:client"
