provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "2.70.0"
  }
}

module "ef-cms_apis" {
  source              = "../template/"
  environment         = var.environment
  zone_name           = var.zone_name
  dns_domain          = var.dns_domain
  cognito_suffix      = var.cognito_suffix
  email_dmarc_policy  = var.email_dmarc_policy
  es_instance_count   = var.es_instance_count
  honeybadger_key     = var.honeybadger_key
  irs_superuser_email = var.irs_superuser_email
}
