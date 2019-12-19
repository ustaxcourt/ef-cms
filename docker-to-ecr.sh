#!/bin/bash

# get aws account id if it does not exist in env var
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-`aws sts get-caller-identity --query "Account"`}
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID%\"}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID#\"}"

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name ef-cms-us-east-1 --image-ids imageTag=latest --query 'images[].imageManifest' --output text)

if [[ ! -z $MANIFEST ]]; then 
  aws ecr batch-delete-image --repository-name ef-cms-us-east-1 --image-ids imageTag="latest"
  aws ecr put-image --repository-name ef-cms-us-east-1 --image-tag "SNAPSHOT-$IMAGE_TAG" --image-manifest "$MANIFEST"
fi

$(aws ecr get-login --no-include-email --region us-east-1)

docker build -t "ef-cms-us-east-1:latest" -f Dockerfile-CI .
docker tag "ef-cms-us-east-1:latest" "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"
