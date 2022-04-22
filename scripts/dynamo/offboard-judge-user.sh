#!/bin/bash

# Updates the offboarded judge user in the dynamo table based on their userId passed in

# Usage
#   ./offboard-judge-user.sh 68686578-bc34-4aea-bc1d-25e505422843

# Arguments
#   - $1 - The userId of the judge to offboard

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The value to set for the judge userId must be provided as the \$1 argument." && exit 1
USER_ID=$1
REGION=us-east-1

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

# should we do it to both like this? or just SOURCE_TABLE?
TABLES=(
  "alpha"
  "beta"
)

for table in "${TABLES[@]}"; do
  # for checking that we have the right object
  JUDGE_USER=$(aws dynamodb get-item --region ${REGION} --table-name "efcms-${ENV}-${table}" \
  --key '{"pk":{"S":"user|'${USER_ID}'"},"sk":{"S":"user|'${USER_ID}'"}}' \
  | jq -r ".Item" \
  )
  echo "---Retrieved Judge User: ${JUDGE_USER}"
  if( [ -z "${JUDGE_USER}" ] ); then
    echo "Could not find judge user with userId: ${USER_ID} on ${table} table."
    exit 1
  fi

  UPDATE_OUTPUT=$(aws dynamodb update-item \
      --table-name "efcms-${ENV}-${table}" \
      --key '{"pk":{"S":"user|'${USER_ID}'"},"sk":{"S":"user|'${USER_ID}'"}}' \
      --update-expression 'SET #role = :role, #section = :section' \
      --expression-attribute-names '{"#role": "role", "#section": "section"}' \
      --expression-attribute-values '{":role": {"S": "legacyJudge"}, ":section": {"S": "legacyJudgesChambers"}}' \
      --return-values UPDATED_NEW \
      --region ${REGION} \
  )

  echo "---Updated attributes of user ${USER_ID}: ${UPDATE_OUTPUT} on ${table} table."
done

