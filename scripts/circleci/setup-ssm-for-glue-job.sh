#!/usr/bin/env bash
set -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

# setting migrate flag to false
echo "setting migrate flag to false"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/migrate" --value "false" --type "String" --overwrite

# setting source-table-version to alpha
echo "setting source-table-version to alpha"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/source-table-version" --value "alpha" --type "String" --overwrite

# setting destination-table-version to alpha
echo "setting destination-table-version to alpha"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/destination-table-version" --value "alpha" --type "String" --overwrite
