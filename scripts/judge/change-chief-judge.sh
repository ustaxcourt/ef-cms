#!/bin/bash -e

# Run this script to change an old chief judge to a judge, and promote a new judge to a chief judge

# example usage:
  # NEW_JUDGE_ID=06b6fb09-889f-427d-9d45-b99023f6539b \
  # OLD_JUDGE_ID=3adacd2c-d266-4041-9698-b8fe431bbf7c \
  # ENV=test \
  # ./scripts/judge/change-chief-judge.sh

./check-env-variables.sh \
  "ENV" \
  "OLD_JUDGE_ID" \
  "NEW_JUDGE_ID"

REGION="us-east-1"
# look up current table version from deploy table
TABLE_VERSION=$(aws dynamodb get-item \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"source-table-version"}, "sk":{"S":"source-table-version"}}' \
  --output text \
  --region "${REGION}" \
  --query 'Item.current.S')

# get judge name from dynamo table
NEW_JUDGE_NAME=$(aws dynamodb get-item \
  --table-name "efcms-${ENV}-${TABLE_VERSION}" \
  --key "{\"pk\":{\"S\":\"user|${NEW_JUDGE_ID}\"}, \"sk\":{\"S\":\"user|${NEW_JUDGE_ID}\"}}" \
  --output text \
  --region "${REGION}" \
  --query 'Item.judgeFullName.S')

if [[ "${NEW_JUDGE_NAME}" == "None" ]]; then
  echo "ERROR: Judge with userId: ${NEW_JUDGE_ID} has no dynamo record"
  exit 1
fi

# update the judge's signature in deploy table
ITEM=$(cat <<-END
{
    "pk": {
        "S": "chief-judge-name"
    },
    "sk":{
        "S": "chief-judge-name"
    },
    "current": {
        "S": "${NEW_JUDGE_NAME}"
    }
}
END
)

aws dynamodb put-item \
    --region "${REGION}" \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"

# update the old judge's title to now only be Judge
OLD_JUDGE_NAME=$(aws dynamodb update-item \
    --region "${REGION}" \
    --table-name "efcms-${ENV}-${TABLE_VERSION}" \
    --update-expression "SET #judgeTitle = :judgeTitle" \
    --expression-attribute-names '{"#judgeTitle":"judgeTitle"}' \
    --expression-attribute-values '{":judgeTitle":{"S":"Judge"}}' \
    --key "{\"pk\":{\"S\":\"user|${OLD_JUDGE_ID}\"}, \"sk\":{\"S\":\"user|${OLD_JUDGE_ID}\"}}" \
    --return-values "ALL_NEW" | jq -r '.Attributes.name.S')

echo "Updating judge with last name: ${OLD_JUDGE_NAME} to Judge"

# update the new judge's title to be Chief Judge
NEW_JUDGE_NAME=$(aws dynamodb update-item \
    --region "${REGION}" \
    --table-name "efcms-${ENV}-${TABLE_VERSION}" \
    --update-expression "SET #judgeTitle = :judgeTitle" \
    --expression-attribute-names '{"#judgeTitle":"judgeTitle"}' \
    --expression-attribute-values '{":judgeTitle":{"S":"Chief Judge"}}' \
    --key "{\"pk\":{\"S\":\"user|${NEW_JUDGE_ID}\"}, \"sk\":{\"S\":\"user|${NEW_JUDGE_ID}\"}}" \
    --return-values "ALL_NEW" | jq -r '.Attributes.name.S')

echo "Updating judge with last name: ${NEW_JUDGE_NAME} to Chief Judge"
