#!/usr/bin/env bash
set -e

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.15.7"* ]]; then
  echo "Please set your terraform version to 1.15.7 before deploying."
  exit 1
fi
