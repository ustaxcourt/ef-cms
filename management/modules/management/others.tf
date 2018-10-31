module "vpc" {
  source = "../vpc"

  environment = "${var.environment}"
  deployment = "${var.deployment}"
}
