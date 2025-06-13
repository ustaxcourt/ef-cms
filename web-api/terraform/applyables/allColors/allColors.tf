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
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.97.0"
    }
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
  environment           = var.environment
  es_instance_count     = var.es_instance_count
  es_instance_type      = var.es_instance_type
  es_volume_size        = var.es_volume_size
  lower_env_account_id  = var.lower_env_account_id
  prod_env_account_id   = var.prod_env_account_id
  should_es_alpha_exist = var.should_es_alpha_exist
  should_es_beta_exist  = var.should_es_beta_exist
  zone_name             = var.zone_name
  providers = {
    aws           = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
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
  source                 = "../../modules/ui-public-www-redirect"
  dns_domain             = var.dns_domain
  environment            = var.environment
  zone_name              = var.zone_name
  public_certificate_arn = module.ui-public-certificate.acm_certificate_arn
  viewer_protocol_policy = var.viewer_protocol_policy
}

module "public-ui-healthcheck" {
  source     = "../../modules/ui-healthcheck"
  count      = var.enable_health_checks
  alarm_name = "${var.dns_domain} is accessible over HTTPS"
  dns_domain = var.dns_domain
}

module "ui-healthcheck" {
  source     = "../../modules/ui-healthcheck"
  count      = var.enable_health_checks
  alarm_name = "app.${var.dns_domain} is accessible over HTTPS"
  dns_domain = "app.${var.dns_domain}"
}

module "kms" {
  source      = "../../modules/kms"
  environment = var.environment

  providers = {
    aws           = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "rds" {
  source                   = "../../modules/rds"
  environment              = var.environment
  postgres_master_username = var.postgres_master_username
  postgres_master_password = var.postgres_master_password
  kms_key_id_primary       = module.kms.kms_key_id_primary
  kms_key_id_replica       = module.kms.kms_key_id_replica
  min_capacity             = var.rds_min_capacity
  max_capacity             = var.rds_max_capacity
  delete_protection        = true
  restoring_aws_account_id = var.restoring_aws_account_id

  providers = {
    aws           = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "rum" {
  source      = "../../modules/rum"
  domain      = var.dns_domain
  environment = var.environment
  sample_rate = var.rum_sample_rate
}
