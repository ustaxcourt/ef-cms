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

  . ./scripts/env/set-env.zsh "${env}" || log_error "Failed to switch environments: ${env}"; exit 1
}
