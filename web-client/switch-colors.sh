#!/usr/bin/env bash

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${AWS_ACCOUNT_ID}" ] && echo "You must have AWS_ACCOUNT_ID set in your environment" && exit 1
[ -z "${CURRENT_COLOR}" ] && echo "You must have CURRENT_COLOR set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

# disabling aws pager https://github.com/aws/aws-cli/pull/4702#issue-344978525
export AWS_PAGER=""
# disable pager to newer cli version
export PAGER=""

# exit on any failure
set -eo pipefail

# Enable traffic on the deploying color
./web-api/terraform/bin/edit-lambda-environment.sh -l "api_async_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false
./web-api/terraform/bin/edit-lambda-environment.sh -l "api_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false
./web-api/terraform/bin/edit-lambda-environment.sh -l "api_public_${ENV}_${DEPLOYING_COLOR}" -k DISABLE_HTTP_TRAFFIC -v false

npx ts-node --transpile-only ./web-client/switch-public-ui-colors.ts
npx ts-node --transpile-only ./web-client/switch-ui-colors.ts
npx ts-node --transpile-only ./web-client/switch-api-colors.ts
npx ts-node --transpile-only ./web-client/switch-public-api-colors.ts
npx ts-node --transpile-only ./web-api/switch-bounce-handler-colors.ts

./web-api/terraform/bin/edit-lambda-environment.sh -l "api_async_${ENV}_${CURRENT_COLOR}" -k DISABLE_HTTP_TRAFFIC -v true
./web-api/terraform/bin/edit-lambda-environment.sh -l "api_${ENV}_${CURRENT_COLOR}" -k DISABLE_HTTP_TRAFFIC -v true
./web-api/terraform/bin/edit-lambda-environment.sh -l "api_public_${ENV}_${CURRENT_COLOR}" -k DISABLE_HTTP_TRAFFIC -v true

aws ssm put-parameter --region us-east-1 --name "/DAWSON/${ENV}/current-color" --value "${DEPLOYING_COLOR}" --type "String" --overwrite
