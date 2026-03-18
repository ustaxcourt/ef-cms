provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.36.0"
    }
  }
}

module "stale-cases-email-cron" {
  source                       = "../../modules/stale-cases-email-cron"
  environment                  = var.environment
  aws_region                   = "us-east-1"
  database_name                = var.database_name
  disable_emails               = "false"
  email_source                 = var.email_source
  inactivity_report_recipients = var.inactivity_report_recipients
  postgres_host                = var.postgres_host
  postgres_user                = var.postgres_user
}
