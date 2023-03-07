#!/bin/bash -e

# shellcheck disable=SC1091
source ../bin/deploy-init.sh

terraform plan -destroy -out execution-plan
terraform destroy -auto-approve
