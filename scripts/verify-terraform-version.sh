#!/bin/bash -e

tf_version=$(terraform --version)

if [[ ${tf_version} != *"1.9.8"* ]]; then
  echo "Please set your terraform version to 1.9.8 before deploying."
  exit 1
fi
