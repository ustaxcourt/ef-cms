#!/bin/bash -e

export DOCKER_DEFAULT_PLATFORM=linux/amd64

./check-env-variables.sh \
  "DESTINATION_TAG" \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name "docket-entry-zipper-${ENV}" --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1 --query 'images[].imageManifest' --output text)

# DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
DEPLOYING_COLOR="blue"
WEST_WEBSOCKET_API_GATEWAY_ID=$(aws apigatewayv2 get-apis --region us-west-1 --query "Items[?Name=='websocket_api_${ENV}_${DEPLOYING_COLOR}'].ApiId" --output text)
EAST_WEBSOCKET_API_GATEWAY_ID=$(aws apigatewayv2 get-apis --region us-east-1 --query "Items[?Name=='websocket_api_${ENV}_${DEPLOYING_COLOR}'].ApiId" --output text)

if [[ -n $MANIFEST ]]; then

  read -p "Manifest already exists. Do you want to continue? (y/n): " -n 1 -r
  echo    # move to a new line

  [[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Exiting without making changes."; exit 1; }


  aws ecr batch-delete-image --repository-name "docket-entry-zipper-${ENV}" --image-ids imageTag="${DESTINATION_TAG}" --region us-east-1
  aws ecr put-image --repository-name "docket-entry-zipper-${ENV}" --image-tag "SNAPSHOT-${DESTINATION_TAG}-${IMAGE_TAG}" --image-manifest "${MANIFEST}" --region us-east-1
fi

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"

docker build --no-cache \
  --build-arg EAST_WEBSOCKET_API_GATEWAY_ID="${EAST_WEBSOCKET_API_GATEWAY_ID}" \
  --build-arg WEST_WEBSOCKET_API_GATEWAY_ID="${WEST_WEBSOCKET_API_GATEWAY_ID}" \
  -t "docket-entry-zipper-${ENV}:${DESTINATION_TAG}" \
  -f Dockerfile .

docker tag "docket-entry-zipper-${ENV}:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-${ENV}:${DESTINATION_TAG}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-${ENV}:${DESTINATION_TAG}"

docker tag "docket-entry-zipper-${ENV}:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-${ENV}:latest"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-${ENV}:latest"