#!/bin/bash -e

# shellcheck disable=SC1091
source ../bin/deploy-init.sh

terraform plan
terraform apply -auto-approve
