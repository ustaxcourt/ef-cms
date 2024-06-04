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
terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="documents-${ENV}.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo init allColors complete
terraform state pull > "./documents-${ENV}.tfstate" # A
echo allColors state pull complete


cd "../../../../web-client/terraform/main"
rm -rf .terraform/ .terraform.lock.hcl
terraform init -upgrade -backend=true -backend-config=bucket="${ZONE_NAME}.terraform.deploys" -backend-config=key="ui-${ENV}.tfstate" -backend-config=dynamodb_table="efcms-terraform-lock" -backend-config=region="us-east-1"
echo ui init complete
terraform state pull > "./ui-${ENV}.tfstate" # B
echo ui state pull complete

cd "../../../web-api/terraform/applyables/allColors"
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.module.ui-public-certificate module.ui-public-certificate
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_s3_bucket.public_redirect module.ui-public-www-redirect.aws_s3_bucket.public_redirect
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_cloudfront_distribution.public_distribution_www module.ui-public-www-redirect.aws_cloudfront_distribution.public_distribution_www
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.environment.aws_route53_record.public_www_redirect module.ui-public-www-redirect.aws_route53_record.public_www_redirect
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.dynamsoft_us_east module.dynamsoft_us_east
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" module.dynamsoft_us_west module.dynamsoft_us_west
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_route53_record.record_certs module.dynamsoft_us_east.aws_route53_record.record_certs
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_acm_certificate_validation.dns_validation_east module.dynamsoft_us_east.aws_acm_certificate_validation.dns_validation
terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_acm_certificate_validation.dns_validation_west module.dynamsoft_us_west.aws_acm_certificate_validation.dns_validation

if [ "$IS_DYNAMSOFT_ENABLED" == "1" ]; then
  echo IS_DYNAMSOFT_ENABLED RUNNING
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_route53_record.record_east_www module.dynamsoft_us_east.aws_route53_record.record_www
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_route53_record.record_west_www module.dynamsoft_us_west.aws_route53_record.record_www
fi

if [ "$ENABLE_HEALTH_CHECKS" == "1" ]; then
  echo ENABLE_HEALTH_CHECKS RUNNING
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_cloudwatch_metric_alarm.public_ui_health_check[0] module.public-ui-healthcheck[0].aws_cloudwatch_metric_alarm.ui_health_check
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_route53_health_check.public_ui_health_check[0] module.public-ui-healthcheck[0].aws_route53_health_check.ui_health_check
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_cloudwatch_metric_alarm.ui_health_check[0] module.ui-healthcheck[0].aws_cloudwatch_metric_alarm.ui_health_check
  terraform state mv -state="../../../../web-client/terraform/main/ui-${ENV}.tfstate" -state-out="documents-${ENV}.tfstate" aws_route53_health_check.ui_health_check[0] module.ui-healthcheck[0].aws_route53_health_check.ui_health_check
fi

echo state mv complete

terraform state push "./documents-${ENV}.tfstate"
echo state push complete

