#!/bin/bash

export DOCKER_DEFAULT_PLATFORM=linux/amd64

./check-env-variables.sh \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

[[ -z "$DESTINATION_TAG" ]] && DESTINATION_TAG=$(grep 'docker-image:' .circleci/config.yml | awk -F':' '{print $3}')
IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name ef-cms-us-east-1 --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1 --query 'images[].imageManifest' --output text)

if [[ -n $MANIFEST ]]; then
  read -p "Manifest already exists. Do you want to continue? (y/n): " -n 1 -r
  echo    # move to a new line

  [[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Exiting without making changes."; exit 1; }

  aws ecr batch-delete-image --repository-name ef-cms-us-east-1 --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1
  aws ecr put-image --repository-name ef-cms-us-east-1 --image-tag "SNAPSHOT-${DESTINATION_TAG}-${IMAGE_TAG}" --image-manifest "${MANIFEST}" --region us-east-1
fi

LOCAL_IMAGE_NAME="ef-cms-us-east-1:${DESTINATION_TAG}"
LOCAL_IMAGE_EXISTS=$(docker images -q "$LOCAL_IMAGE_NAME" 2> /dev/null)
BUILD_IMAGE=1
if [[ -n $LOCAL_IMAGE_EXISTS ]]; then
  read -p "Image already exists. Do you want to build it again? (y/n): " -n 1 -r
  echo

  [[ ! $REPLY =~ ^[Yy]$ ]] && BUILD_IMAGE=0
fi
if [[ "$BUILD_IMAGE" -eq 1 ]]; then
  docker build --platform=linux/amd64 --no-cache -t "$LOCAL_IMAGE_NAME" -f Dockerfile .
  if [[ $? -ne 0 ]]; then
    echo "Docker build failed. Exiting without pushing to ECR."
    exit 1
  fi
fi

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

docker tag "ef-cms-us-east-1:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:${DESTINATION_TAG}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:${DESTINATION_TAG}"
