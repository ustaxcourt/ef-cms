provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
    bucket         = "gov.ustaxcourt.ef-cms.apis.terraform.deploys"
    key            = "apis/terraform/dev.tfstate"
    region         = "us-east-1"
    dynamodb_table = "dev-efcmsapi-terraform-lock"
  }
}

module "ef-cms_apis" {
  source      = "../template/"
  environment = "dev"
}