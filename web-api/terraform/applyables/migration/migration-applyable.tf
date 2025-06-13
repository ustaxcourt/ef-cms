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

module "migration" {
  source               = "../../modules/migration"
  aws_region           = "us-east-1"
  environment          = var.environment
  stream_arn           = var.stream_arn
  destination_table    = var.destination_table
  source_table         = var.source_table
  elasticsearch_domain = var.elasticsearch_domain
}
