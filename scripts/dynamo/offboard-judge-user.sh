#!/bin/bash

# Sets the value for the request limit of the IP limiter

# Usage
#   ./set-maintenance-mode.sh Guy

# Arguments
#   - $1 - The name of the judge to offboard

[ -z "$1" ] && echo "The value to set for the judge name must be provided as the \$1 argument." && exit 1
JUDGE_NAME=$1

../../check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb scan \
    --table-name MusicCollection \
    --filter-expression "Artist = :a" \
    --projection-expression "#ST, #AT" \
    --expression-attribute-names file://expression-attribute-names.json \
    --expression-attribute-values file://expression-attribute-values.json

JUDGE_DATA=$(aws dynamodb scan --table-name "efcms-${ENV}-alpha"  --filter-expression "role = :a" "section"= :b  --expression-attribute-values {":a": {"S": "judge"}, ":b": {"S": "guysChambers"}}\)
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
