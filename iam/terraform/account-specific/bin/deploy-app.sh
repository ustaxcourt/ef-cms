#!/bin/bash -e

# shellcheck disable=SC1091 # this file does exist, we promise
source ../bin/deploy-init.sh

# terraform import aws_s3_bucket.ustc_log_snapshots_bucket ustc-log-snapshots

# terraform apply
terraform plan

