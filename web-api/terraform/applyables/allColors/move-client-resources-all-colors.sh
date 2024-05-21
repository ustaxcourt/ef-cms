#!/bin/bash -e

ENV=$1

../../../../scripts/verify-terraform-version.sh

# exit on any failure
set -eo pipefail

terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="documents-${ENV}.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo 111111111
terraform state pull > "./documents-${ENV}.tfstate" # A
echo 2222222222

cd "../../../../web-client/terraform/main"
terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="ui-${ENV}.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo 33333333
terraform state pull > "./ui-${ENV}.tfstate" # B
echo 4444444

cd "../../../web-api/terraform/applyables/allColors"
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.module.ui-public-certificate module.ui-public-certificate
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_s3_bucket.public_redirect module.ui-public-www-redirect.aws_s3_bucket.public_redirect
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_cloudfront_distribution.public_distribution_www module.ui-public-www-redirect.aws_cloudfront_distribution.public_distribution_www
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_route53_record.public_www_redirect module.ui-public-www-redirect.aws_route53_record.public_www_redirect
echo 5555555

# terraform state push ./ui-${ENV}.tfstate
terraform state list | grep ui-public-certificate
# cd "../../../web-api/terraform/applyables/allColors"
# terraform state push ./documents-${ENV}.tfstate

