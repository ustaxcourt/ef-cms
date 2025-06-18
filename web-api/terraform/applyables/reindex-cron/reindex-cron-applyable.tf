provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.100.0"
    }
  }
}

module "reindex-cron" {
  source                    = "../../modules/reindex-cron"
  aws_region                = "us-east-1"
  environment               = var.environment
  destination_table         = var.destination_table
  source_table              = var.source_table
  circle_workflow_id        = var.circle_workflow_id
  migrate_flag              = var.migrate_flag
  circle_machine_user_token = var.circle_machine_user_token
  deployment_timestamp      = var.deployment_timestamp
}
