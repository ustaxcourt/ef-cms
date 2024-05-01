#!/bin/bash -e

# shellcheck disable=SC1091
source ../bin/deploy-init.sh

# 10345 Cleanup: Delete all of the iam/terraform/environment-specific folder
terraform destroy -auto-approve
