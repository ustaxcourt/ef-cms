#!/bin/bash

../../check-env-variables.sh "ENV"

aws events disable-rule --name "check_reindex_status_cron_${ENV}" --region us-east-1
