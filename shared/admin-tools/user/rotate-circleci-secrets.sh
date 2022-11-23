#!/bin/bash -e

./check-env-variables.sh \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"
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
aws iam create-access-key --user-name CircleCI
