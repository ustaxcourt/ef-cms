#!/bin/bash -e

./check-env-variables.sh \
  "DESTINATION_TAG" \
  "PUBLIC_ECR_ID" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

# IMAGE_TAG=$(git rev-parse --short HEAD)
# MANIFEST=$(aws ecr-public batch-get-image --repository-name ef-cms-us-east-1-public --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1 --query 'images[].imageManifest' --output text)

# if [[ -n $MANIFEST ]]; then
  # aws ecr-public batch-delete-image --repository-name ef-cms-us-east-1-public --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1
# aws ecr-public put-image --repository-name ef-cms-us-east-1-public --image-tag "SNAPSHOT-${DESTINATION_TAG}-${IMAGE_TAG}" --image-manifest "${MANIFEST}" --region us-east-1
# fi

# shellcheck disable=SC2091
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public"
docker build -t "ef-cms-us-east-1-public:${DESTINATION_TAG}" -f Dockerfile .
docker tag "ef-cms-us-east-1-public:${DESTINATION_TAG}" "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public:${DESTINATION_TAG}"
docker push "public.ecr.aws/${PUBLIC_ECR_ID}/ef-cms-us-east-1-public:${DESTINATION_TAG}"
