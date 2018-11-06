#!/usr/bin/env bash
. ./init-app.sh "$@"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" terraform apply -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "environment=${ENVIRONMENT}"