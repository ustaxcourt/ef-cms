#!/bin/bash

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${AWS_ACCOUNT_ID}" ] && echo "You must have AWS_ACCOUNT_ID set in your environment" && exit 1
[ -z "${CURRENT_COLOR}" ] && echo "You must have CURRENT_COLOR set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

MIGRATE_FLAG=$(./scripts/dynamo/get-migrate-flag.sh "${ENV}")

# disabling aws pager https://github.com/aws/aws-cli/pull/4702#issue-344978525
export AWS_PAGER=""
# disable pager to newer cli version
export PAGER=""

# exit on any failure
set -eo pipefail

# turn off the old stream if we are not doing a migration so we do not
# have 2 streams processing the same stuff
if [[ "${MIGRATE_FLAG}" == "false" ]]; then
  UUID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${CURRENT_COLOR}" --region us-east-1 | jq -r ".EventSourceMappings[0].UUID")
  aws lambda update-event-source-mapping --uuid "${UUID}" --region us-east-1 --no-enabled
fi

# explicitly turn on deploying color stream, just in case
UUID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${DEPLOYING_COLOR}" --region us-east-1 | jq -r ".EventSourceMappings[0].UUID")
aws lambda update-event-source-mapping --uuid "${UUID}" --region us-east-1

npx ts-node --transpile-only ./web-client/switch-public-ui-colors.js
npx ts-node --transpile-only ./web-client/switch-ui-colors.js
npx ts-node --transpile-only ./web-client/switch-api-colors.ts
npx ts-node --transpile-only ./web-client/switch-public-api-colors.ts
npx ts-node --transpile-only ./web-api/switch-bounce-handler-colors.js
npx ts-node --transpile-only ./web-api/switch-health-check-domain.ts

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"current-color"},"sk":{"S":"current-color"},"current":{"S":"'"${DEPLOYING_COLOR}"'"}}'

# check if both streams are disabled
UUID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${CURRENT_COLOR}" --region us-east-1 | jq -r ".EventSourceMappings[0].UUID")
CURRENT_STATE=$(aws lambda get-event-source-mapping --uuid "${UUID}" --region us-east-1 | jq ".State")

UUID=$(aws lambda list-event-source-mappings --function-name "arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:streams_${ENV}_${DEPLOYING_COLOR}" --region us-east-1 | jq -r ".EventSourceMappings[0].UUID")
DEPLOYING_STATE=$(aws lambda get-event-source-mapping --uuid "${UUID}" --region us-east-1 | jq ".State")

echo "CURRENT COLOR dynamodb stream is currently ${CURRENT_STATE}";
echo "DEPLOYING COLOR dynamodb stream is currently ${DEPLOYING_STATE}";

if [[ "${CURRENT_STATE}" == "\"Disabled\"" && "${DEPLOYING_STATE}" == "\"Disabled\"" ]]; then
  echo "ERROR"
  echo "ERROR: Both streams were disabled!  Something went wrong when switching colors!"
  echo "ERROR"
  exit 1;
fi

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"pending-color-switch"},"sk":{"S":"pending-color-switch"},"current":{"BOOL":false}}'
