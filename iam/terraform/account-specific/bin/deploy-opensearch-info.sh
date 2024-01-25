#!/bin/bash -e

# shellcheck disable=SC1091 # this file does exist, we promise
source ../bin/deploy-init.sh

terraform import aws_s3_bucket.ustc_log_snapshots_bucket "$LOG_SNAPSHOT_BUCKET_NAME"
terraform import opensearch_snapshot_repository.archived-logs archived-logs
terraform import aws_s3_bucket_acl.ustc_log_snapshots_bucket "$LOG_SNAPSHOT_BUCKET_NAME"
terraform plan
