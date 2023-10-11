#!/bin/bash

./check-env-variables.sh \
  "AWS_ACCESS_KEY_ID" \
  "AWS_ACCOUNT_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "CIRCLE_BRANCH" \
  "CIRCLE_MACHINE_USER_TOKEN" \
  "CIRCLE_PROJECT_SLUG" \
  "DESTINATION_BUCKET" \
  "REFERRER" \
  "SOURCE_BUCKET"

EXPIRATION="${1:-59m}"

timeout "$EXPIRATION" aws s3 sync "s3://${SOURCE_BUCKET}" "s3://${DESTINATION_BUCKET}" --delete
S3_SYNC_RESULT="$?"

if [[ "$S3_SYNC_RESULT" -eq 124 ]]; then
  echo "Timeout reached, re-launching workflow to continue sync"
  curl --request POST \
    --url "https://circleci.com/api/v2/project/${CIRCLE_PROJECT_SLUG}/pipeline" \
    --header "Circle-Token: ${CIRCLE_MACHINE_USER_TOKEN}" \
    --header "content-type: application/json" \
    --data "{\"branch\":\"${CIRCLE_BRANCH}\", \"parameters\":{ \
      \"run_build_and_deploy\":false, \
      \"run_sync_s3_to_lower_env\":true, \
      \"referrer\":\"${REFERRER}\", \
      \"source_bucket\":\"${SOURCE_BUCKET}\", \
      \"destination_bucket\":\"${DESTINATION_BUCKET}\"}}"
  exit 0
fi

if [[ "$S3_SYNC_RESULT" -eq 0 ]]; then
  echo "Sync completed, approving referrer"
  export APPROVAL_JOB_NAME="wait-for-s3-sync-workflow"
  CIRCLE_WORKFLOW_ID="$REFERRER" npx ts-node --transpile-only ./scripts/circleci/approve-pending-job.ts
  exit 0
fi

echo "Error syncing S3 buckets, canceling referrer"
CIRCLE_WORKFLOW_ID="$REFERRER" npx ts-node --transpile-only ./scripts/circleci/cancel-workflow.ts
exit $S3_SYNC_RESULT
