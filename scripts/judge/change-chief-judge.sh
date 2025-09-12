#!/bin/bash -e

# Run this script to change an old chief judge to a judge, and promote a new judge to a chief judge

# example usage:
  # NEW_JUDGE_ID=06b6fb09-889f-427d-9d45-b99023f6539b \
  # OLD_JUDGE_ID=ca8a384a-6875-4ae5-ac60-dcb76a120495 \
  # ENV=test \
  # ./scripts/judge/change-chief-judge.sh

./check-env-variables.sh \
  "ENV" \
  "OLD_JUDGE_ID" \
  "NEW_JUDGE_ID"

REGION="us-east-1"

# get judge name via postgres (TypeScript script)
NEW_JUDGE_NAME=$(ENV="${ENV}" REGION="${REGION}" ./scripts/judge/get-judge-name.ts "${NEW_JUDGE_ID}")

if [[ "${NEW_JUDGE_NAME}" == "None" ]]; then
  echo "ERROR: Judge with userId: ${NEW_JUDGE_ID} has no record"
  exit 1
fi

npx ts-node --transpile-only ./scripts/postgres/featureFlags/setup-chief-judge-name-flag.ts "${NEW_JUDGE_NAME}"

# update the old judge's title in Postgres and capture last name for display
OLD_JUDGE_JSON=$(ENV="${ENV}" REGION="${REGION}" ./scripts/judge/set-judge-title.ts "${OLD_JUDGE_ID}" "Judge")
OLD_JUDGE_LAST_NAME=$(echo "${OLD_JUDGE_JSON}" | jq -r '.name')
OLD_JUDGE_EMAIL=$(echo "${OLD_JUDGE_JSON}" | jq -r '.email')
echo "Updating judge with last name: ${OLD_JUDGE_LAST_NAME} to Judge"

# update the new judge's title in Postgres and capture last name for display
NEW_JUDGE_JSON=$(ENV="${ENV}" REGION="${REGION}" ./scripts/judge/set-judge-title.ts "${NEW_JUDGE_ID}" "Chief Judge")
NEW_JUDGE_LAST_NAME=$(echo "${NEW_JUDGE_JSON}" | jq -r '.name')
NEW_JUDGE_EMAIL=$(echo "${NEW_JUDGE_JSON}" | jq -r '.email')
echo "Updating judge with last name: ${NEW_JUDGE_LAST_NAME} to Chief Judge"

# update the judge's names in cognito
USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

# will not work on lower envs (emails are sanitized during glue job; email differs in cognito vs persistence)
aws cognito-idp admin-update-user-attributes \
    --user-pool-id "${USER_POOL_ID}" \
    --region "${REGION}" \
    --username "${OLD_JUDGE_EMAIL}" \
    --user-attributes "Name=name,Value=\"Judge ${OLD_JUDGE_LAST_NAME}\""

aws cognito-idp admin-update-user-attributes \
    --user-pool-id "${USER_POOL_ID}" \
    --region "${REGION}" \
    --username "${NEW_JUDGE_EMAIL}" \
    --user-attributes "Name=name,Value=\"Chief Judge ${NEW_JUDGE_LAST_NAME}\""
