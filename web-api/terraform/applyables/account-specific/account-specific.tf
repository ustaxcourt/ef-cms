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
  backend "s3" {}

  required_providers {
    aws = "5.69.0"
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}

module "health-alarms-east" {
  source = "../../modules/health-alarms"
  providers = {
    aws = aws.us-east-1
  }
}

module "health-alarms-west" {
  source = "../../modules/health-alarms"
  providers = {
    aws = aws.us-west-1
  }
}

module "api-gateway-global-logging-permissions" {
  source = "../../modules/api-gateway-global-logging-permissions"
}

module "ci-cd" {
  source = "../../modules/ci-cd"
}

module "kibana" {
  source                           = "../../modules/kibana"
  cognito_suffix                   = var.cognito_suffix
  es_logs_ebs_volume_size_gb       = var.es_logs_ebs_volume_size_gb
  es_logs_instance_count           = var.es_logs_instance_count
  es_logs_instance_type            = var.es_logs_instance_type
  sns_alarm_arn                    = module.health-alarms-east.topic_arn
  log_group_environments           = var.log_group_environments
  number_of_days_to_keep_info_logs = var.number_of_days_to_keep_info_logs
  log_snapshot_bucket_name         = var.log_snapshot_bucket_name
  providers = {
    aws           = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dawson-developer-permissions" {
  source                       = "../../modules/dawson-developer-permissions"
  dawson_dev_trusted_role_arns = var.dawson_dev_trusted_role_arns
}

module "dynamsoft" {
  source    = "../../modules/dynamsoft-permissions"
  zone_name = var.zone_name
}

module "edge-lambda-permissions" {
  source = "../../modules/edge-lambda-permissions"
}

module "route53-zone" {
  source    = "../../modules/route53-zone"
  zone_name = var.zone_name
}

module "email-monitoring" {
  source = "../../modules/email-monitoring"
}
