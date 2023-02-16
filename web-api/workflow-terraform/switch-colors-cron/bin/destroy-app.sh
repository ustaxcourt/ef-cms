#!/bin/bash -e

mkdir -p ./lambdas/dist
touch ./lambdas/dist/switch-colors.js

# shellcheck disable=SC1091
source ../bin/deploy-init.sh

terraform plan -destroy -out execution-plan
terraform destroy -auto-approve
