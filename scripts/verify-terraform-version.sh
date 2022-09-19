#!/bin/bash -e

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.2.9"* ]]; then
  echo "Please set your terraform version to 1.2.9 before deploying."
  exit 1
fi
