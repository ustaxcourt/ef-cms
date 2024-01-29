provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.32.0"
  }
}

module "glue_migration" {
  source            = "./glue"
  number_of_workers = var.number_of_workers
  source_table      = var.source_table
  destination_table = var.destination_table
  external_role_arn = var.external_role_arn
}
