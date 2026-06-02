#!/usr/bin/env bash

./check-env-variables.sh \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "CIRCLE_MACHINE_USER_TOKEN" \
  "ENV"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Aborted rotate-circleci-secrets.sh"
  exit $EXIT_CODE
fi

# remove any existing keys; they are stale
content=$(aws iam list-access-keys --user-name CircleCI)
for row in $(echo "${content}" | jq -r '.AccessKeyMetadata[] | @base64'); do
    _jq() {
      echo "${row}" | base64 --decode | jq -r "${1}"
    }
    old_access_key_id=$(_jq '.AccessKeyId')
    aws iam delete-access-key --access-key-id "${old_access_key_id}" --user-name CircleCI
done

# create new access key
NEW_KEY_JSON=$(aws iam create-access-key --user-name CircleCI)

NEW_ACCESS_KEY_ID=$(echo "${NEW_KEY_JSON}" | jq -r '.AccessKey.AccessKeyId')
NEW_SECRET_ACCESS_KEY=$(echo "${NEW_KEY_JSON}" | jq -r '.AccessKey.SecretAccessKey')

# update CircleCI context
if [ -z "${CIRCLE_CONTEXT}" ]; then
  # Map ENV to branch name
  case $ENV in
    dev) BRANCH="develop" ;;
    irs) BRANCH="irs" ;;
    prod) BRANCH="prod" ;;
    mig) BRANCH="migration" ;;
    test) BRANCH="test" ;;
    stg) BRANCH="staging" ;;
    exp[1-9]) BRANCH="experimental${ENV#exp}" ;;
    *)
      echo "Could not determine CircleCI context for ENV: '${ENV}'. Please set CIRCLE_CONTEXT explicitly."
      exit 1
      ;;
  esac
  CIRCLE_CONTEXT="efcms-${BRANCH}"
fi

echo "Updating CircleCI context: ${CIRCLE_CONTEXT}"

./scripts/circleci/update-aws-credentials-in-context.ts \
  --awsAccessKeyId "${NEW_ACCESS_KEY_ID}" \
  --awsSecretAccessKey "${NEW_SECRET_ACCESS_KEY}" \
  --contextName "${CIRCLE_CONTEXT}"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Unable to update CircleCI context '${CIRCLE_CONTEXT}'. Please update the AWS credentials in the context manually."
  echo
  echo "$NEW_KEY_JSON"
  exit $EXIT_CODE
fi
