#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

# TODO: we may still need this
echo "setting migrate flag to false"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/migrate" --value "false" --type "String" --overwrite

# TODO: I'm not sure we need this anymore
echo "setting source-table-version to alpha"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/source-table-version" --value "alpha" --type "String" --overwrite

# TODO: I'm not sure we need this anymore
echo "setting destination-table-version to alpha"
aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/destination-table-version" --value "alpha" --type "String" --overwrite
