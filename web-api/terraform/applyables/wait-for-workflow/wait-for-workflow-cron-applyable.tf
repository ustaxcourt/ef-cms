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

module "wait-for-workflow-cron" {
  source                    = "../../modules/wait-for-workflow-cron"
  aws_region                = var.aws_region
  environment               = var.environment
  circle_workflow_id        = var.circle_workflow_id
  circle_machine_user_token = var.circle_machine_user_token
  circle_pipeline_id        = var.circle_pipeline_id
  approval_job_name         = var.approval_job_name
}
