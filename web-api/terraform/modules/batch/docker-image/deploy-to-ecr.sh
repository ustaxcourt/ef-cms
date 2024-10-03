#!/bin/bash -e

TARGET_REGION=$1
export DOCKER_DEFAULT_PLATFORM=linux/amd64

echo "Running script to deploy Docker Image to ECR"

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

DEPLOYING_COLOR=$(../../../../../scripts/dynamo/get-deploying-color.sh "${ENV}")
echo "Current color -> ${DEPLOYING_COLOR}"
echo "Region -> ${TARGET_REGION}"

LATEST_TAGS=$(aws ecr describe-images \
  --repository-name "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}" \
	--query "imageDetails[?contains(imageTags, \`latest\`)].imageTags" \
	--region "${TARGET_REGION}")

LATEST_VERSION=$(echo "$LATEST_TAGS" | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' | sort -V | tail -1)

if [[ -z "$LATEST_VERSION" ]]; then
  echo "No 'latest' tag found. Using version 1.0.0 as the starting point."
  DESTINATION_TAG="1.0.0"
else
  echo "Found 'latest' tag: ${LATEST_VERSION}"
  IFS='.' read -r major minor patch <<< "$LATEST_VERSION"
  patch=$((patch + 1))
  DESTINATION_TAG="${major}.${minor}.${patch}"
fi

MANIFEST=$(aws ecr batch-get-image --repository-name "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}" --image-ids imageTag="${DESTINATION_TAG}" --region "${TARGET_REGION}" --query 'images[].imageManifest' --output text)

WEBSOCKET_API_GATEWAY_ID=$(aws apigatewayv2 get-apis --region "${TARGET_REGION}" --query "Items[?Name=='websocket_api_${ENV}_${DEPLOYING_COLOR}'].ApiId" --output text)

if [[ -n $MANIFEST ]]; then
  echo "A Docker image with the destination tag ${DESTINATION_TAG} already exists. Deleting the existing image."
  aws ecr batch-delete-image --repository-name "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}" --image-ids imageTag="${DESTINATION_TAG}" --region "${TARGET_REGION}"
fi

aws ecr get-login-password --region "${TARGET_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com"

docker build --no-cache \
  --build-arg AWS_REGION="${TARGET_REGION}" \
  --build-arg WEBSOCKET_API_GATEWAY_ID="${WEBSOCKET_API_GATEWAY_ID}" \
  -t "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:${DESTINATION_TAG}" \
  -f Dockerfile .

docker tag "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:${DESTINATION_TAG}"
docker tag "docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:${DESTINATION_TAG}" "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:latest"

docker push "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:${DESTINATION_TAG}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.${TARGET_REGION}.amazonaws.com/docket-entry-zipper-${ENV}-${DEPLOYING_COLOR}-${TARGET_REGION}:latest"
