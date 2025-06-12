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

module "stale-cases-email-cron" {
  source                       = "../../modules/stale-cases-email-cron"
  aws_region                   = "us-east-1"
  environment                  = var.environment
  disable_emails               = "false"
  elasticsearch_endpoint       = var.elasticsearch_endpoint
  email_source                 = var.email_source
  inactivity_report_recipients = var.inactivity_report_recipients
}
