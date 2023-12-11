provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.29.0"
  }
}

data "aws_caller_identity" "current" {}
