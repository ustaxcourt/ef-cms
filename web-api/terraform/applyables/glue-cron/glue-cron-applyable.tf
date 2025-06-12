provider "aws" {
  region = "us-east-1"
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

module "glue-cron" {
  source                    = "../../modules/glue-cron"
  environment               = var.environment
  aws_region                = "us-east-1"
  circle_workflow_id        = var.circle_workflow_id
  circle_machine_user_token = var.circle_machine_user_token
}
