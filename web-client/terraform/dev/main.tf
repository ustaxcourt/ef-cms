provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
  }
}

module "environment" {
  source = "../common"

  environment = "${var.environment}"
  deployment = "${var.deployment}"
  dns_domain = "${var.dns_domain}"
  cloudfront_default_ttl = "${var.cloudfront_default_ttl}"
  cloudfront_max_ttl = "${var.cloudfront_max_ttl}"
}