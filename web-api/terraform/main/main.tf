provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
  }
}

module "ef-cms_apis" {
  source      = "../template/"
  environment = "${var.environment}"
  dns_domain  = "${var.dns_domain}"
  cognito_suffix = "${var.cognito_suffix}"
  ses_dmarc_rua = "${var.ses_dmarc_rua}"
  cloudwatch_role_arn = "${var.cloudwatch_role_arn}"
  post_confirmation_role_arn = "${var.post_confirmation_role_arn}"
  es_instance_count = "${var.es_instance_count}"
}
