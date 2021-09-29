#!/bin/bash

[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1

aws events disable-rule --name "check_reindex_status_cron_${ENV}_${DEPLOYING_COLOR}" --region us-east-1
