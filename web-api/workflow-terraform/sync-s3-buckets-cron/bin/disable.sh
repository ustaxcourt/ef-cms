#!/bin/bash

./check-env-variables.sh "ENV"

aws events disable-rule --name "sync_s3_buckets_cron_${ENV}" --region us-east-1
