#!/bin/bash -e

docker build -t efcms -f Dockerfile .
say "Docker image built"

rm -rf ./dist
say "Dist deleted"

docker run \
  -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
  -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
  -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
  -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
  --rm efcms /bin/sh \
  -c "./web-api/run-serverless-api.sh ${ENV} us-east-1"

docker run \
  -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
  -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
  -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
  -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
  --rm efcms /bin/sh \
  -c "./web-api/run-serverless-cases.sh ${ENV} us-east-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-documents.sh ${ENV} us-east-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-sections.sh ${ENV} us-east-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-trial-sessions.sh ${ENV} us-east-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-users.sh ${ENV} us-east-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-work-items.sh ${ENV} us-east-1"


say "Serverless API deployed east"

# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-api.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-cases.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-documents.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-sections.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-trial-sessions.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-users.sh ${ENV} us-west-1"
#
# docker run \
#   -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
#   -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
#   -e "EFCMS_DOMAIN=${EFCMS_DOMAIN}" \
#   -v $(pwd)/web-api/.cache:/home/app/web-api/.cache \
#   --rm efcms /bin/sh \
#   -c "cd ./web-api && SLS_DEBUG=* ./run-serverless-work-items.sh ${ENV} us-west-1"
#
# say "Users API deployed west"
