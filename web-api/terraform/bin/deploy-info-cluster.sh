#!/bin/bash

set -euo pipefail

log_info() {
  echo "[INFO] $*" >&2
}

log_error() {
  echo "[ERROR] $*" >&2
}

log_success() {
  echo "[SUCCESS] $*" >&2
}

if [ $# -lt 2 ]; then
    log_error "Insufficient arguments provided."
    echo "Usage: $0 <primary-env>"
    echo "Base domain: $0 <base-domain>"
    echo "Consumers: $0 <consumer1> [consumer2 ...]" >&2
fi

PRIMARY_ENV="$1"; shift
BASE_DOMAIN="$1"; shift
CONSUMER_ENVS=("$@")

deploy_primary() {
  local env="$1"
  local domain="$2"
  log_info "Switching to primary environment: ${env}"

  . ./scripts/env/set-env.zsh "${env}" || {
    log_error "Failed to switch environment: ${env}"
    exit 1
    }

  log_info "Writing secrets to primary environment: ${env}"
  npx ts-node scripts/secrets/create-account-secrets.ts \
  --env "${env}" \
  --domain "${domain}" \
  --update || {
     log_error "Failed to write secrets for environment: ${env}"
     exit 1
   }

  log_info "Deploying primary environment: ${env}"
  pushd web-api/terraform/applyables/account-specific/account-specific >/dev/null || {
   log_error "Failed to change directory for Terraform applyables: ${env}"
   exit 1
  }

   ../..//bin/deploy-account-specific.sh || {
    log_error "Failed to deploy primary environment: ${env}"
    popd >/dev/null
    exit 1
  }

  log_info "Capturing info cluster endpoint and arn from Terraform"

  local endpoint
  local arn

  endpoint=$(terraform output -raw es_info_cluster_shared_cluster_endpoint 2>/dev/null) || {
    log_error "Failed to get info cluster shared endpoint from Terraform: ${env}"
    popd >/dev/null
    exit 1
  }

  arn=$(terraform output -raw es_info_cluster_shared_cluster_arn 2>/dev/null) || {
    log_error "Failed to get info cluster shared arn from Terraform: ${env}"
    popd >/dev/null
    exit 1
  }

  popd >/dev/null
  if [ -z "${endpoint}" ] || [ -z "${arn}" ]; then
      log_error "Terraform outputs are empty. Endpoint: '${endpoint}' Arn: '${arn}'"
      exit 1
  fi
  log_success "Primary deployment complete."
  log_info "Cluster endpoint: ${endpoint}"
  log_info "Cluster arn: ${arn}"

  PRIMARY_ENDPOINT="${endpoint}"
  PRIMARY_ARN="${arn}"
}

deploy_primary "${PRIMARY_ENV}" "${BASE_DOMAIN}"
