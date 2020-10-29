provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "2.70.0"
  }
}

module "ef-cms_apis" {
  source                     = "../template/"
  environment                = var.environment
  zone_name                  = var.zone_name
  dns_domain                 = var.dns_domain
  cognito_suffix             = var.cognito_suffix
  email_dmarc_policy         = var.email_dmarc_policy
  es_instance_count          = var.es_instance_count
  es_instance_type           = var.es_instance_type
  honeybadger_key            = var.honeybadger_key
  irs_superuser_email        = var.irs_superuser_email
  deploying_color            = var.deploying_color
  blue_table_name            = var.blue_table_name
  green_table_name           = var.green_table_name
  blue_elasticsearch_domain  = var.blue_elasticsearch_domain
  green_elasticsearch_domain = var.green_elasticsearch_domain
  destination_table          = var.destination_table
  disable_emails             = var.disable_emails
}
