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
    aws = "5.72.1"
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
  source                 = "../../modules/ui-public-www-redirect"
  dns_domain             = var.dns_domain
  environment            = var.environment
  zone_name              = var.zone_name
  public_certificate_arn = module.ui-public-certificate.acm_certificate_arn
  viewer_protocol_policy = var.viewer_protocol_policy
}

module "dynamsoft_us_east" {
  source = "../../modules/dynamsoft"
  count  = var.is_dynamsoft_enabled
  providers = {
    aws = aws.us-east-1
  }

  region                 = "us-east-1"
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_name              = var.zone_name
  ami                    = "ami-0a313d6098716f372"
  availability_zones     = ["us-east-1a"]
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}

module "dynamsoft_us_west" {
  source = "../../modules/dynamsoft"
  count  = var.is_dynamsoft_enabled
  providers = {
    aws = aws.us-west-1
  }

  region                 = "us-west-1"
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_name              = var.zone_name
  ami                    = "ami-06397100adf427136"
  availability_zones     = ["us-west-1a"]
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
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
