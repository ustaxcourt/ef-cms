#!/bin/bash

# Updates the offboarded judge user in the dynamo table

# Usage
#   ./offboard-judge-user.sh Guy

# Arguments
#   - $1 - The name of the judge to offboard

# todo: 
# find the judge (by name? userId is env specific)
# update that judge\'s role to 'legacyJudge' and section to 'legacyJudgesChambers'
# change legacyJudge to judge when we actually commit this, only using legacyJudge since its updated to that on exp2
# do we need to specify source/destination table?

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The value to set for the judge name must be provided as the \$1 argument." && exit 1
JUDGE_NAME=$1
REGION=us-east-1

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

JUDGE_USER_ID=$(aws dynamodb scan \
  --table-name "efcms-${ENV}-alpha"  \
  --filter-expression "#judge_name = :a AND #user_role = :b" \
  --expression-attribute-names '{"#judge_name":"name","#user_role":"role"}' \
  --expression-attribute-values '{":a":{"S":"'${JUDGE_NAME}'"},":b":{"S":"judge"}}' \
  --region ${REGION} \
  | jq -r ".Items[0].userId.S" \
)
echo "Judge user ID found for ${JUDGE_NAME} is: ${JUDGE_USER_ID}"

# for checking that we have the right object
# JUDGE_USER=$(aws dynamodb get-item --region ${REGION} --table-name "efcms-${ENV}-alpha" \
# --key '{"pk":{"S":"user|'${JUDGE_USER_ID}'"},"sk":{"S":"user|'${JUDGE_USER_ID}'"}' \
# | jq -r ".Item.current.S"
# )

# echo "${JUDGE_USER}"

# put-item fully overwrites the object, not just the attribute, should use update-item
# OUTPUT=$(aws dynamodb put-item --region ${REGION} --table-name "efcms-${ENV}-alpha" \
# --item '{"pk":{"S":"user|'${JUDGE_USER_ID}'"},"sk":{"S":"user|'${JUDGE_USER_ID}'"},"role":{"S":"legacyJudge"}}')
# echo "${OUTPUT}"
