#!/usr/bin/env bash

if [[ -z "$AWS_SESSION_EXPIRATION" ]] || [[ -z "$ENV" ]]; then
  echo "Error: No AWS session detected. Use the environment switcher to get a fresh AWS token"
  exit 1
fi

aws_expiration_iso="${AWS_SESSION_EXPIRATION%:*}${AWS_SESSION_EXPIRATION##*:}"
# shellcheck disable=SC2327,SC2328
if [[ -n "$(date --version >/dev/null 2>&1)" ]]; then
  aws_expiration="$(date -d "$aws_expiration_iso" +%s)" # GNU date
else
  aws_expiration="$(date -j -f '%Y-%m-%dT%H:%M:%S%z' "$aws_expiration_iso" +%s)" # BSD date
fi

if [[ "$(date -u +%s)" -ge "$aws_expiration" ]]; then
  echo "Error: AWS session has expired. Use the environment switcher to get a fresh AWS token"
  exit 1
fi

tag="$(grep 'docker-image:' .circleci/config.yml | awk -F':' '{print $3}')"
ecr_image_manifest="$(aws ecr batch-get-image \
  --repository-name ef-cms-us-east-1 \
  --image-ids imageTag="$tag" \
  --region us-east-1 \
  --query 'images[].imageManifest' \
  --output text)"
local_image_name="ef-cms-us-east-1:${tag}"
local_image_exists=$(docker images -q "$local_image_name" 2> /dev/null)

if [[ -n "$ecr_image_manifest" ]]; then
  echo "Image version ${tag} already exists on ${ENV}."
  exit 0
fi

if [[ -z "$CI" ]] || [[ "$CI" == "false" ]]; then
  read -p "Image version ${tag} does not exist. Do you want to deploy it now? (y/n): " -n 1 -r deploy_now
  echo # move to a new line
  [[ ! "$deploy_now" =~ ^[Yy]$ ]] && exit 0
  if [[ -z "$local_image_exists" ]]; then
    deploy_now_prompt="Please select an environment that already has image version ${tag}, "
    deploy_now_prompt+="or choose to build the image locally or exit."
    echo "$deploy_now_prompt"
    options=("exp1" "exp2" "exp3" "exp4" "exp5" "exp6" "exp7" "exp8" "exp9" "test" "build locally now" "quit")
    select choice in "${options[@]}"; do
      [[ "$choice" == "quit" ]] && exit 0
      [[ "$choice" == "build locally now" ]] && break
      deploy_from="$choice"
      break
    done
  fi
fi

if [[ -n "$deploy_from" ]]; then
  npm run deploy:ci-image:from "$deploy_from"
else
  npm run deploy:ci-image
fi
