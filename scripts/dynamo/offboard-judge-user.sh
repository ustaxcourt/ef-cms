#!/bin/bash

# Updates the offboarded judge user in the dynamo table

# Usage
#   ./offboard-judge-user.sh Guy

# Arguments
#   - $1 - The name of the judge to offboard

# todo: 
# find the judge (by name? userId is env specific)
# update that judge\'s role to 'legacyJudge' and section to 'legacyJudgesChambers'

[ -z "$1" ] && echo "The value to set for the judge name must be provided as the \$1 argument." && exit 1
JUDGE_NAME=$1

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

JUDGE_DATA=$(aws dynamodb scan \
--table-name "efcms-${ENV}-alpha"  \
--filter-expression "#judge_name = :a" \
--expression-attribute-names '{"#judge_name":"name"}' \
--expression-attribute-values '{":a":{"S":"'${JUDGE_NAME}'"}}' \
--region us-east-1 \
)
echo "${JUDGE_DATA}"

# ITEM=$(cat <<-END
# {
#   "maxInvocations": {
#     "N": "5"
#   },
#   "name": {
#     "S": "Guy"
#   },
#   "role": {
#     "S": "judge"
#   },
#   "windowTime": {
#     "N": "1000"
#   }
# }
# END
# )

# aws dynamodb put-item \
#     --region us-east-1 \
#     --table-name "efcms-deploy-${ENV}" \
#     --item "${ITEM}"
