provider "aws" {
  region = "us-east-1"
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
    aws = "5.49.0"
  }
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

module "ef-cms_apis" {
  source                = "../../modules/everything-else-deprecated"
  active_ses_ruleset    = var.active_ses_ruleset
  alert_sns_topic_arn   = data.aws_sns_topic.system_health_alarms.arn
  cognito_suffix        = var.cognito_suffix
  dns_domain            = var.dns_domain
  email_dmarc_policy    = var.email_dmarc_policy
  enable_health_checks  = var.enable_health_checks
  environment           = var.environment
  es_instance_count     = var.es_instance_count
  es_instance_type      = var.es_instance_type
  es_volume_size        = var.es_volume_size
  lower_env_account_id  = var.lower_env_account_id
  prod_env_account_id   = var.prod_env_account_id
  should_es_alpha_exist = var.should_es_alpha_exist
  should_es_beta_exist  = var.should_es_beta_exist
  zone_name             = var.zone_name
}

module "ui-public-certificate" {
  source                    = "../../modules/certificates"
  domain_name               = var.dns_domain
  hosted_zone_name          = "${var.zone_name}."
  subject_alternative_names = ["*.${var.dns_domain}"]
  certificate_name          = var.dns_domain
  environment               = var.environment
  description               = "Certificate for public facing ${var.dns_domain}"
  product_domain            = "EFCMS"
}
module "ui-public-www-redirect" {
  source      = "../../modules/ui-public-www-redirect"
  dns_domain  = var.dns_domain
  environment = var.environment
  zone_name   = var.zone_name
}
