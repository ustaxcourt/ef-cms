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

module "switch-colors-cron" {
  source                    = "../../modules/switch-colors-cron"
  aws_region                = var.aws_region
  environment               = var.environment
  circle_workflow_id        = var.circle_workflow_id
  circle_machine_user_token = var.circle_machine_user_token
}
