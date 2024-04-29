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
    aws = "5.44.0"
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
