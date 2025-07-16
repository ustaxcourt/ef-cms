provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
       version = "~> 6.0.0"
    }
  }
}

module "migration-cron" {
  source                    = "../../modules/migration-cron"
  aws_region                = "us-east-1"
  environment               = var.environment
  circle_workflow_id        = var.circle_workflow_id
  migrate_flag              = var.migrate_flag
  circle_machine_user_token = var.circle_machine_user_token
}
