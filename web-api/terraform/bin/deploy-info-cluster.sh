#!/bin/bash
# shellcheck disable=SC1071

set -euo pipefail

pushd "$(dirname "$0")/../../.." >/dev/null || {
  echo "[ERROR] Failed to navigate to project root" >&2
  exit 1
}

log_info() {
  echo "[INFO] $*" >&2
}

log_error() {
  echo "[ERROR] $*" >&2
}

log_success() {
  echo "[SUCCESS] $*" >&2
}

if [[ -z "${ENV:-}" ]]; then
  log_error "ENV environment variable is required."
  exit 1
fi

if [[ -z "${PRIMARY_ENV:-}" ]]; then
  log_error "PRIMARY_ENV environment variable is required."
  exit 1
fi

BASE_DOMAIN="${INFO_CLUSTER_BASE_DOMAIN:-}"
if [[ -z "${BASE_DOMAIN}" && -n "${EFCMS_DOMAIN:-}" ]]; then
  BASE_DOMAIN="${EFCMS_DOMAIN#*.}"
fi

if [[ -z "${BASE_DOMAIN}" ]]; then
  log_error "Base domain is required. Set INFO_CLUSTER_BASE_DOMAIN or EFCMS_DOMAIN environment variable."
  exit 1
fi

deploy_primary() {
  log_info "Deploying primary environment: ${ENV}"

  log_info "Deploying primary environment: ${ENV}"
  pushd web-api/terraform/applyables/account-specific >/dev/null || {
   log_error "Failed to change directory for Terraform applyables: ${ENV}"
   exit 1
  }

   ../../bin/deploy-account-specific.sh || {
    log_error "Failed to deploy primary environment: ${ENV}"
    popd >/dev/null
    exit 1
  }

  log_info "Capturing primary info cluster endpoint and arn from Terraform"

  local endpoint
  local arn

  endpoint=$(terraform output -raw es_info_cluster_shared_cluster_endpoint 2>/dev/null) || {
    log_error "Failed to get info cluster shared endpoint from Terraform: ${ENV}"
    popd >/dev/null
    exit 1
  }

  arn=$(terraform output -raw es_info_cluster_shared_cluster_arn 2>/dev/null) || {
    log_error "Failed to get info cluster shared arn from Terraform: ${ENV}"
    popd >/dev/null
    exit 1
  }

  popd >/dev/null
  if [ -z "${endpoint}" ] || [ -z "${arn}" ]; then
      log_error "Terraform primary outputs are empty. Endpoint: '${endpoint}' Arn: '${arn}'"
      exit 1
  fi
  log_success "Primary deployment complete."
  log_info "Cluster endpoint: ${endpoint}"
  log_info "Cluster arn: ${arn}"

  log_info "Updating secrets with info cluster endpoint, ARN, and primary environment: ${ENV}"
  ./scripts/secrets/create-account-secrets.ts \
    --env "${ENV}" \
    --base-domain "${BASE_DOMAIN}" \
    --es-info-cluster-shared-endpoint "${endpoint}" \
    --es-info-cluster-shared-arn "${arn}" \
    --es-info-cluster-primary-env "${ENV}" \
    --update || {
     log_error "Failed to update primary secrets with cluster info for environment: ${ENV}"
     exit 1
   }

  log_success "Primary secrets updated with cluster endpoint and ARN."
  export PRIMARY_ENDPOINT="${endpoint}"
  export PRIMARY_ARN="${arn}"
}

deploy_consumer() {

  log_info "Switching to consumer environment: ${ENV}"
  
  log_info "Loading variables from Secrets Manager into Environment"
  ./scripts/load-environment-from-secrets.sh || {
   log_error "Failed to get variables from Secrets Manager, environment: ${ENV}"
   popd >/dev/null
   exit 1
 }

  log_info "Deploying consumer environment: ${ENV}"
  pushd web-api/terraform/applyables/account-specific >/dev/null || {
   log_error "Failed to change consumer directory for Terraform applyables: ${ENV}"
   exit 1
  }

   ../../bin/deploy-account-specific.sh || {
    log_error "Failed to deploy consumer environment: ${ENV}"
    popd >/dev/null
    exit 1
  }

  popd >/dev/null
  log_success "Consumer deployment complete for: ${ENV}"
}

if [[ "${PRIMARY_ENV}" == "${ENV}" ]]; then
  log_info "Current ENV (${ENV}) matches PRIMARY_ENV (${PRIMARY_ENV}). Running primary deployment."
  deploy_primary
  log_success "Primary deployment completed successfully!"
  log_info "Kibana url: https://${PRIMARY_ENDPOINT}/_dashboard"
else
  log_info "Current ENV (${ENV}) does not match PRIMARY_ENV (${PRIMARY_ENV}). Running consumer deployment."
  deploy_consumer
  log_success "Consumer deployment completed successfully!"
fi