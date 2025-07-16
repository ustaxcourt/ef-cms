#!/bin/bash

./check-env-variables.sh \
  "ENV" \
  "EFCMS_DOMAIN" \

set -euo pipefail

BUCKET_NAME="${EFCMS_DOMAIN}-software"

echo "Clearing bucket: $BUCKET_NAME"

# Check if bucket exists
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Bucket $BUCKET_NAME does not exist or access denied."
  exit 1
fi

# Check if versioning is enabled
VERSIONING_STATUS=$(aws s3api get-bucket-versioning --bucket "$BUCKET_NAME" --query 'Status' --output text)

if [[ "$VERSIONING_STATUS" == "Enabled" || "$VERSIONING_STATUS" == "Suspended" ]]; then
  echo "Versioning is enabled, deleting all object versions and delete markers..."

  # List all object versions and delete markers
  aws s3api list-object-versions --bucket "$BUCKET_NAME" --output json |
    jq -r '.Versions[]?, .DeleteMarkers[]? | [.Key, .VersionId] | @tsv' |
    while IFS=$'\t' read -r key version_id; do
      echo "Deleting $key (version: $version_id)"
      aws s3api delete-object --bucket "$BUCKET_NAME" --key "$key" --version-id "$version_id"
    done
else
  echo "Deleting all objects (no versioning)..."
  aws s3 rm "s3://$BUCKET_NAME" --recursive
fi

echo "Bucket $BUCKET_NAME has been emptied."