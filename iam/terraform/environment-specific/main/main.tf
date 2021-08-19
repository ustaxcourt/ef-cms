provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "3.49.0"
  }
}
