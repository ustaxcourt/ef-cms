provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
  }
}

module "management" {
  source = "../modules/management"

  dns_domain = "${var.dns_domain}"

  ssh_cidrs = "${var.ssh_cidrs}"
  environment = "${var.environment}"
  deployment = "${var.deployment}"
}
