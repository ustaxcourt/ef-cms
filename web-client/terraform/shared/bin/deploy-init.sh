#!/bin/bash -e

ENV=$1

# Getting the environment-specific deployment settings and injecting them into the shell environment
pushd ../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd

../../../../check-env-variables.sh \
  "DYNAMSOFT_PRODUCT_KEYS" \
  "DYNAMSOFT_S3_ZIP_PATH" \
  "DYNAMSOFT_URL" \
  "ENABLE_HEALTH_CHECKS"\
  "ENV" \
  "EFCMS_DOMAIN" \
  "IS_DYNAMSOFT_ENABLED" \
  "ZONE_NAME"

echo "Running terraform with the following environment configs:"
echo "  - DYNAMSOFT_PRODUCT_KEYS=${DYNAMSOFT_PRODUCT_KEYS}"
echo "  - DYNAMSOFT_S3_ZIP_PATH=${DYNAMSOFT_S3_ZIP_PATH}"
echo "  - DYNAMSOFT_URL=${DYNAMSOFT_URL}"
echo "  - ENABLE_HEALTH_CHECKS=${ENABLE_HEALTH_CHECKS}"
echo "  - ENV=${ENV}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - IS_DYNAMSOFT_ENABLED=${IS_DYNAMSOFT_ENABLED}"
echo "  - ZONE_NAME=${ZONE_NAME}"

DYNAMSOFT_URL="https://dynamsoft-lib.${EFCMS_DOMAIN}"

if [[ -z "${IS_DYNAMSOFT_ENABLED}" ]]; then
  IS_DYNAMSOFT_ENABLED="1"
fi

export TF_PLUGIN_CACHE_DIR=./terraform-cache
export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_dynamsoft_product_keys=$DYNAMSOFT_PRODUCT_KEYS
export TF_VAR_dynamsoft_s3_zip_path=$DYNAMSOFT_S3_ZIP_PATH
export TF_VAR_dynamsoft_url=$DYNAMSOFT_URL
export TF_VAR_environment=$ENV
export TF_VAR_is_dynamsoft_enabled=$IS_DYNAMSOFT_ENABLED
export TF_VAR_statuspage_dns_record=$STATUSPAGE_DNS_RECORD
export TF_VAR_zone_name=$ZONE_NAME
export TF_VAR_enable_health_checks=$ENABLE_HEALTH_CHECKS

if [[ -n "${CW_VIEWER_PROTOCOL_POLICY}" ]]; then
  export TF_VAR_viewer_protocol_policy=$CW_VIEWER_PROTOCOL_POLICY
fi

../../../../shared/terraform/bin/init.sh ui
