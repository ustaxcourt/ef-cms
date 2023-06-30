#!/bin/bash -e

./check-env-variables.sh "ENV"

aws events enable-rule --name "empty_s3_bucket_cron_${ENV}" --region us-east-1
