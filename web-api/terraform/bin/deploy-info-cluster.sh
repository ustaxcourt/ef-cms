#!/bin/zsh
# shellcheck disable=SC1071

set -e
set -u
setopt pipefail

log_info() {
  echo "[INFO] $*" >&2
}

log_error() {
  echo "[ERROR] $*" >&2
}

log_success() {
  echo "[SUCCESS] $*" >&2
}

switch_environment() {
  local env_name="$1"

  set +u
  pushd "${REPO_ROOT}" >/dev/null || {
    log_error "Failed to change directory to repo root."
    exit 1
  }

  export DEFAULT_ENV="${DEFAULT_ENV:-local}"
  export DEFAULT_ORG=""

  . ./scripts/env/set-env.zsh ${env_name} || {
    log_error "Failed to switch environment: ${env_name}"
    popd >/dev/null || true
    set -u
    exit 1
  }

  popd >/dev/null || true
  set -u
}

ensure_aws_profile() {
  local env_name="$1"

  if [[ -z "${AWS_PROFILE:-}" ]]; then
    export AWS_PROFILE="${env_name}"
    log_info "AWS_PROFILE not set. Defaulting to ${AWS_PROFILE}"
  fi
}

run_account_specific_terraform() {
  local env_name="$1"
  local context="$2"

  pushd web-api/terraform/applyables/account-specific >/dev/null || {
    log_error "Failed to change directory for Terraform applyables: ${context}"
    exit 1
  }

  ../../bin/deploy-account-specific.sh || {
    log_error "Failed to deploy account-specific Terraform for environment: ${env_name}"
    popd >/dev/null
    exit 1
  }

  popd >/dev/null
}

SCRIPT_PATH="${(%):-%N}"
SCRIPT_DIR="${SCRIPT_PATH:A:h}"
REPO_ROOT="${SCRIPT_DIR}/../../.."

if [ $# -lt 1 ]; then
  log_error "Insufficient arguments provided."
  echo "Usage: $0 <primary-env> [base-domain] [consumer1 consumer2 ...]" >&2
  exit 1
fi

PRIMARY_ENV="$1"; shift

if [ $# -gt 0 ]; then
  BASE_DOMAIN="$1"
  shift
else
  BASE_DOMAIN="${INFO_CLUSTER_BASE_DOMAIN:-}"
fi

if [[ -z "${BASE_DOMAIN}" && -n "${EFCMS_DOMAIN:-}" ]]; then
  BASE_DOMAIN="${EFCMS_DOMAIN#*.}"
fi

if [[ -z "${BASE_DOMAIN}" ]]; then
  log_error "Base domain is required. Provide it as an argument or via INFO_CLUSTER_BASE_DOMAIN (or EFCMS_DOMAIN)."
  exit 1
fi

if [ $# -gt 0 ]; then
  CONSUMER_ENVS=("$@")
else
  CONSUMER_ENVS=()
  if [[ -n "${INFO_CLUSTER_CONSUMER_ENVS:-}" ]]; then
    sanitized_consumers="$(echo "${INFO_CLUSTER_CONSUMER_ENVS}" | tr ',' ' ')"
    read -r -a consumer_list <<< "${sanitized_consumers}"
    for consumer in "${consumer_list[@]}"; do
      consumer_trimmed="${consumer//[[:space:]]/}"
      if [[ -n "${consumer_trimmed}" ]]; then
        CONSUMER_ENVS+=("${consumer_trimmed}")
      fi
    done
  fi
fi

deploy_primary() {
  local env_input="$1"
  local domain="$2"

  log_info "Switching to primary environment: ${env_input}"
  log_info "Current working directory: $(pwd)"

  switch_environment "${env_input}"
  ensure_aws_profile "${env_input}"

  log_info "Writing secrets to primary environment: ${env_input}"
  ./scripts/secrets/create-account-secrets.ts \
    --env "${env_input}" \
    --domain "${domain}" \
    --update || {
     log_error "Failed to write primary secrets for environment: ${env_input}"
     exit 1
   }

  log_info "Deploying primary environment: ${env_input}"
  run_account_specific_terraform "${env_input}" "primary"

  log_info "Capturing primary info cluster endpoint and arn from Terraform"

  local endpoint
  local arn

  endpoint=$(terraform output -raw es_info_cluster_shared_cluster_endpoint 2>/dev/null) || {
    log_error "Failed to get info cluster shared endpoint from Terraform: ${env_input}"
    popd >/dev/null
    exit 1
  }

  arn=$(terraform output -raw es_info_cluster_shared_cluster_arn 2>/dev/null) || {
    log_error "Failed to primary get info cluster shared arn from Terraform: ${env_input}"
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

  PRIMARY_ENDPOINT="${endpoint}"
  PRIMARY_ARN="${arn}"
}

deploy_primary "${PRIMARY_ENV}" "${BASE_DOMAIN}"

deploy_consumer() {
  local env_input="$1"
  local domain="$2"
  local shared_endpoint="$3"
  local shared_arn="$4"

  log_info "Switching to consumer environment: ${env_input}"

  switch_environment "${env_input}"
  ensure_aws_profile "${env_input}"

  log_info "Writing secrets to consumer environment: ${env_input}"
  ./scripts/secrets/create-account-secrets.ts \
    --env "${env_input}" \
    --domain "${domain}" \
    --es-info-cluster-shared-endpoint "${shared_endpoint}" \
    --es-info-cluster-shared-arn "${shared_arn}" \
    --update || {
     log_error "Failed to write consumer secrets for environment: ${env_input}"
     exit 1
   }

  log_info "Deploying consumer environment: ${env_input}"
  run_account_specific_terraform "${env_input}" "consumer"

  log_success "Consumer deployment complete for: ${env_input}"
}

if [ ${#CONSUMER_ENVS[@]} -eq 0 ]; then
    log_info "No consumer environments specified. Only primary was deployed."
else
    log_info "Deploying ${#CONSUMER_ENVS[@]} consumer environments: ${CONSUMER_ENVS[*]}"
    failed_consumers=()
    for ENV_NAME in "${CONSUMER_ENVS[@]}"; do
      if ! deploy_consumer "${ENV_NAME}" "${BASE_DOMAIN}" "${PRIMARY_ENDPOINT}" "${PRIMARY_ARN}"; then
          log_error " Consumer deploy failed for: ${ENV_NAME}"
          failed_consumers+=("${ENV_NAME}")
      fi
    done
    
    if [ ${#failed_consumers[@]} -gt 0 ]; then
        log_error "Deployment failed for consumers: ${failed_consumers[*]}"
        exit 1
    fi
fi

log_success "All deployments completed successfully!"
log_info "Kibana url: https://${PRIMARY_ENDPOINT}/_dashboard"