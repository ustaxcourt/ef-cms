#!/usr/bin/env bash
. ./deploy-init.sh "$@"

TF_VAR_my_s3_state_bucket=${BUCKET} TF_VAR_my_s3_state_key=${KEY} terraform apply --var "dns_domain=${EFCMS_DOMAIN}"