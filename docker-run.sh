#!/bin/bash -e

# This script will only work when ran on linux due to the volume mount.
# If you're macOS, you'll need to add npm i to the start the -c and run `npm run clean` before starting 
# this script.

docker build -t efcms -f Dockerfile .
docker run -it \
  -e AWS_ACCESS_KEY_ID=S3RVER \
  -e AWS_SECRET_ACCESS_KEY=S3RVER \
  -p 1234:1234 \
  -p 5678:5678 \
  -p 3011:3011 \
  -p 4000:4000 \
  -p 5000:5000 \
  -p 8000:8000 \
  -p 8001:8001 \
  -p 9001:9001 \
  -p 9200:9200 \
  -v "$(pwd)":/home/app \
  --rm efcms /bin/sh \
  -c "(npm run start:api &) && (npm run dynamo:admin &) && (./wait-until-services.sh && sleep 10 && npm run print:success &) && (npm run start:client &) && npm run start:public"
