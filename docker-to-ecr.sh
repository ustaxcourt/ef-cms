#!/bin/bash -e

./check-env-variables.sh \
  "DESTINATION_TAG" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name ef-cms-us-east-1 --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1 --query 'images[].imageManifest' --output text)

if [[ -n $MANIFEST ]]; then

  read -p "Manifest already exists. Do you want to continue? (y/n): " -n 1 -r
  echo    # move to a new line

  [[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Exiting without making changes."; exit 1; }


  aws ecr batch-delete-image --repository-name ef-cms-us-east-1 --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1
  aws ecr put-image --repository-name ef-cms-us-east-1 --image-tag "SNAPSHOT-${DESTINATION_TAG}-${IMAGE_TAG}" --image-manifest "${MANIFEST}" --region us-east-1
fi

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

docker build --progress=plain --no-cache -t "ef-cms-us-east-1:${DESTINATION_TAG}" -f Dockerfile .
docker tag "ef-cms-us-east-1:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:${DESTINATION_TAG}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:${DESTINATION_TAG}"
