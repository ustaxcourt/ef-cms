#!/bin/bash -e

./check-env-variables.sh "ENV"

aws events disable-rule --name "check_migration_status_cron_${ENV}" --region us-east-1
