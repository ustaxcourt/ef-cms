#!/bin/bash -e

./check-env-variables.sh "ENV"

aws events enable-rule --name "check_glue_job_status_cron_${ENV}" --region us-east-1
