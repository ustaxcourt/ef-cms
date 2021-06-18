#!/bin/bash

set -e

[ -z "$1" ] && echo "The TAG to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID" ] && [ -z "$AWS_SECRET_ACCESS_KEY" ] && echo "Error: you must have AWS credentials setup to run this script" && exit 1

DESTINATION_TAG=$1

# get aws account id if it does not exist in env var
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query "Account" --output text)}

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name ef-cms-us-east-1 --image-ids imageTag=$DESTINATION_TAG --region us-east-1 --query 'images[].imageManifest' --output text)

if [[ -n $MANIFEST ]]; then
  aws ecr batch-delete-image --repository-name ef-cms-us-east-1 --image-ids imageTag="$DESTINATION_TAG" --region us-east-1
  aws ecr put-image --repository-name ef-cms-us-east-1 --image-tag "SNAPSHOT-$DESTINATION_TAG-$IMAGE_TAG" --image-manifest "$MANIFEST" --region us-east-1
fi

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build --no-cache -t "ef-cms-us-east-1:$DESTINATION_TAG" -f Dockerfile-CI .
docker tag "ef-cms-us-east-1:$DESTINATION_TAG" "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:$DESTINATION_TAG"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:$DESTINATION_TAG"
