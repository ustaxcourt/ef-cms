#!/usr/bin/env bash
set -e

required_version="1.16.5"

tf_version=$(terraform --version)
tf_version_line=${tf_version%%$'\n'*}

if [[ ${tf_version_line} != "Terraform v${required_version}" ]]; then
  echo "Please set your terraform version to ${required_version} before deploying."
  exit 1
fi
