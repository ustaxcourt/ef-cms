#!/bin/bash -e
docker build -t efcms -f Dockerfile .
docker run -it \
  -e AWS_ACCESS_KEY_ID=S3RVER \
  -e AWS_SECRET_ACCESS_KEY=S3RVER \
  -p 1234:1234 \
  -p 5678:5678 \
  -p 4000:4000 \
  -p 8000:8000 \
  -p 8001:8001 \
  -p 9000:9000 \
  -p 9200:9200 \
  --rm efcms /bin/sh \
  -c "(npm run start:api &) && (npm run dynamo:admin &) && (./wait-until-services.sh && sleep 10 && npm run print:success &) && (npm run start:client &) && npm run start:public"
