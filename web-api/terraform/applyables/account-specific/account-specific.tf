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
    aws = {
      source  = "hashicorp/aws"
       version = "~>6.15"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.3.2"
    }
  }
}

module "health-alarms-east" {
  source = "../../modules/health-alarms"
}

module "api-gateway-global-logging-permissions" {
  source = "../../modules/api-gateway-global-logging-permissions"
}

module "ci-cd" {
  source               = "../../modules/ci-cd"
  lower_env_restore_roles = var.lower_env_restore_roles
}

module "kibana" {
  source                           = "../../modules/kibana"
  cognito_suffix                   = var.cognito_suffix
  es_logs_ebs_volume_size_gb       = var.es_logs_ebs_volume_size_gb
  es_logs_instance_count           = var.es_logs_instance_count
  es_logs_instance_type            = var.es_logs_instance_type
  es_logs_engine_version           = var.es_logs_engine_version
  sns_alarm_arn                    = module.health-alarms-east.topic_arn
  log_group_environments           = var.log_group_environments
  number_of_days_to_keep_info_logs = var.number_of_days_to_keep_info_logs
  log_snapshot_bucket_name         = var.log_snapshot_bucket_name
  es_info_cluster_create           = var.es_info_cluster_create
  es_info_cluster_shared_cluster_endpoint = var.es_info_cluster_shared_cluster_endpoint
  es_info_cluster_shared_cluster_arn = var.es_info_cluster_shared_cluster_arn
}

module "dawson-developer-permissions" {
  source                       = "../../modules/dawson-developer-permissions"
  dawson_dev_trusted_role_arns = var.dawson_dev_trusted_role_arns
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

module "default_vpc_east" {
  source = "../../modules/default-vpc"
  providers = {
    aws = aws.us-east-1
  }
}

module "default_vpc_west" {
  source = "../../modules/default-vpc"
  providers = {
    aws = aws.us-west-1
  }
}
