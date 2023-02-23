#!/bin/bash

ENVIRONMENT=$1

# Getting the environment-specific deployment settings and injecting them into the shell environment
export ENV=${ENVIRONMENT}
pushd ../../../../
# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh
popd || exit 1

[ -z "${ENVIRONMENT}" ] && echo "You must have ENVIRONMENT set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

if [[ ${ENVIRONMENT} == "prod" ]]; then
  if [[ ${EFCMS_DOMAIN} != *"dawson"* ]]; then
    echo "ENVIRONMENT and EFCMS_DOMAIN do not match. Please check your environment variables and run again."
    exit 1
  fi
elif [[ ${EFCMS_DOMAIN} != "${ENVIRONMENT}"* ]]; then
  echo "ENVIRONMENT and EFCMS_DOMAIN do not match. Please check your environment variables and run again."
  exit 1
fi

export TF_VAR_dns_domain=$EFCMS_DOMAIN
export TF_VAR_environment=$ENVIRONMENT

../../../../shared/terraform/bin/init.sh permissions
