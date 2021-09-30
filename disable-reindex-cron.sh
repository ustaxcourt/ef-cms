#!/bin/bash

[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1

aws events disable-rule --name "check_reindex_status_cron_${ENV}" --region us-east-1
