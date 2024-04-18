provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.44.0"
  }
}

module "reindex-cron" {
  source                    = "../../modules/reindex-cron"
  aws_region                = var.aws_region
  environment               = var.environment
  destination_table         = var.destination_table
  source_table              = var.source_table
  circle_workflow_id        = var.circle_workflow_id
  migrate_flag              = var.migrate_flag
  circle_machine_user_token = var.circle_machine_user_token
  deployment_timestamp      = var.deployment_timestamp
}
