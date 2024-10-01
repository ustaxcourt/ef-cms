#!/bin/bash -e

TARGET_REGION=$1
export DOCKER_DEFAULT_PLATFORM=linux/amd64

echo "Running script to deploy Docker Immage to ${TARGET_REGION} ECR"

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

TAGS=$(aws ecr list-images --repository-name "docket-entry-zipper-${ENV}-${TARGET_REGION}" --query 'imageIds[*].imageTag' --region "${TARGET_REGION}" --output text)
LATEST_VERSION=$(echo "$TAGS" | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' | sort -V | tail -1)
if [[ -z "$LATEST_VERSION" ]]; then
  DESTINATION_TAG="1.0.0"
else
  IFS='.' read -r major minor patch <<< "$LATEST_VERSION"
  patch=$((patch + 1))
  DESTINATION_TAG="${major}.${minor}.${patch}"
fi

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name "docket-entry-zipper-${ENV}-${TARGET_REGION}" --image-ids imageTag="${DESTINATION_TAG}" --region "${TARGET_REGION}" --query 'images[].imageManifest' --output text)

# DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
DEPLOYING_COLOR="blue"
WEBSOCKET_API_GATEWAY_ID=$(aws apigatewayv2 get-apis --region "${TARGET_REGION}" --query "Items[?Name=='websocket_api_${ENV}_${DEPLOYING_COLOR}'].ApiId" --output text)

if [[ -n $MANIFEST ]]; then

  read -p "Manifest already exists. Do you want to continue? (y/n): " -n 1 -r
  echo    # move to a new line

  [[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Exiting without making changes."; exit 1; }


  aws ecr batch-delete-image --repository-name "docket-entry-zipper-${ENV}-${TARGET_REGION}" --image-ids imageTag="${DESTINATION_TAG}" --region "${TARGET_REGION}"
  aws ecr put-image --repository-name "docket-entry-zipper-${ENV}-${TARGET_REGION}" --image-tag "SNAPSHOT-${DESTINATION_TAG}-${IMAGE_TAG}" --image-manifest "${MANIFEST}" --region "${TARGET_REGION}"
fi

aws ecr get-login-password --region "${TARGET_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com"

docker build --no-cache \
  --build-arg AWS_REGION="${TARGET_REGION}" \
  --build-arg WEBSOCKET_API_GATEWAY_ID="${WEBSOCKET_API_GATEWAY_ID}" \
  -t "docket-entry-zipper-${ENV}-${TARGET_REGION}:${DESTINATION_TAG}" \
  -f Dockerfile .

docker tag "docket-entry-zipper-${ENV}-${TARGET_REGION}:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${TARGET_REGION}:${DESTINATION_TAG}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${TARGET_REGION}:${DESTINATION_TAG}"