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

module "migration" {
  source                = "../../modules/migration"
  aws_region            = var.aws_region
  environment           = var.environment
  stream_arn            = var.stream_arn
  destination_table     = var.destination_table
  source_table          = var.source_table
  documents_bucket_name = var.documents_bucket_name
  elasticsearch_domain  = var.elasticsearch_domain
}
