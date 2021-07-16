#!/bin/bash

set -e

[ -z "$1" ] && echo "The TAG to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID" ] && [ -z "$AWS_SECRET_ACCESS_KEY" ] && echo "Error: you must have AWS credentials setup to run this script" && exit 1

ENVIRONMENT=$1

# get aws account id if it does not exist in env var
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query "Account" --output text)}

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# create the repository if it doesn't exist
aws ecr create-repository --repository-name clamav --region us-east-1 2>/dev/null || :

docker build --no-cache -t "clamav:${ENVIRONMENT}" -f ./web-api/terraform/main/Dockerfile ./web-api/terraform/main/
docker tag "clamav:${ENVIRONMENT}" "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/clamav:${ENVIRONMENT}"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/clamav:${ENVIRONMENT}"
