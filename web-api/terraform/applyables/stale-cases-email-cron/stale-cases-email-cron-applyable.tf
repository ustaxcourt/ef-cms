provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.83.1"
    }
  }
}

module "stale-cases-email-cron" {
  source                       = "../../modules/stale-cases-email-cron"
  aws_region                   = var.aws_region
  environment                  = var.environment
  bounced_email_recipient      = var.bounced_email_recipient
  disable_emails               = "false"
  email_source                 = var.email_source
  inactivity_report_recipients = var.inactivity_report_recipients
}
