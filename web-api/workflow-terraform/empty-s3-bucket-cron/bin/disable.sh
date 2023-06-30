#!/bin/bash

./check-env-variables.sh "ENV"

aws events disable-rule --name "empty_s3_bucket_cron_${ENV}" --region us-east-1
