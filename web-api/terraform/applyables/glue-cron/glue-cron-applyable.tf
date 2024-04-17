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

module "glue-cron" {
  source                    = "../../modules/glue-cron"
  environment               = var.environment
  aws_region                = var.aws_region
  circle_workflow_id        = var.circle_workflow_id
  circle_machine_user_token = var.circle_machine_user_token
}
