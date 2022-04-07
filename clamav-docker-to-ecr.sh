#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

# create the repository if it doesn't exist
aws ecr create-repository --repository-name clamav --region us-east-1 2>/dev/null || :

docker build --no-cache -t "clamav:${ENV}" -f ./web-api/terraform/main/Dockerfile ./web-api/terraform/main/
docker tag "clamav:${ENV}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/clamav:${ENV}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/clamav:${ENV}"
