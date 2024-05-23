#!/bin/bash -e

ENV=$1

../../../../scripts/verify-terraform-version.sh

# Getting the environment-specific deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
  pushd ../../../../
  # shellcheck disable=SC1091
  . ./scripts/load-environment-from-secrets.sh
  popd
fi

# exit on any failure
set -eo pipefail

rm -rf .terraform/ .terraform.lock.hcl
terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="documents-${ENV}-green.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo 111111111
terraform state pull > "./documents-${ENV}-green.tfstate" # A
echo 2222222222

cd "../../../../web-client/terraform/main"
rm -rf .terraform/ .terraform.lock.hcl
terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="ui-${ENV}.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo 33333333
terraform state pull > "./ui-${ENV}.tfstate" # B
echo 4444444

cd "../../../web-api/terraform/applyables/green"

terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}-green.tfstate" module.environment.module.ui-green module.ui-green

echo 5555555

terraform state push "./documents-${ENV}-green.tfstate"
echo 6666666

