provider "aws" {
  region = "${var.aws_region}"
}

terraform {
  backend "s3" {
  }
}

module "management" {
  source = "git@github.com:flexion/flexion-terraform//management?ref=task/temp_repo"

  dns_domain = "${var.dns_domain}"

  ssh_cidrs = "${var.ssh_cidrs}"
  environment = "${var.environment}"
  deployment = "${var.deployment}"
}
