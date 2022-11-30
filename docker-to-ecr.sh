#!/bin/bash -e

./check-env-variables.sh \
  "DESTINATION_TAG" \
  "PUBLIC_ECR_ID" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

# shellcheck disable=SC2091
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public-images"
docker build -t "ef-cms-us-east-1-public-images:${DESTINATION_TAG}" -f Dockerfile .
docker tag "ef-cms-us-east-1-public-images:${DESTINATION_TAG}" "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public-images:${DESTINATION_TAG}"
docker push "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public-images:${DESTINATION_TAG}"
