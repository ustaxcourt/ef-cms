provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }
}

module "ef-cms_apis" {
  source      = "../template/"
  environment = var.environment
  dns_domain  = var.dns_domain
  cognito_suffix = var.cognito_suffix
  ses_dmarc_rua = var.ses_dmarc_rua
  es_instance_count = var.es_instance_count
  honeybadger_key = var.honeybadger_key
  irs_superuser_email = var.irs_superuser_email
}
