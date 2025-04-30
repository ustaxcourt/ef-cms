#!/bin/bash

# creates the entry for maintenance mode flag in the systems manager

# Usage
#   ENV=dev ./setup-maintenance-mode-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/maintenance-mode" --value "false" --type "String" --overwrite
