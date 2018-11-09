provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-east-2"
  alias = "us-east-2"
}

provider "aws" {
  region = "us-west-1"
  alias = "us-west-1"
}

resource "aws_s3_bucket" "deployment_us_east_1" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.deploys"
  acl = "private"
  provider = "aws.us-east-1"
  region = "us-east-1"

  tags {
    environment = "${var.environment}"
  }
}


resource "aws_s3_bucket" "deployment_us_west_2" {
  provider = "aws.us-west-1"
  region = "us-west-1"
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.deploys"
  acl = "private"

  tags {
    environment = "${var.environment}"
  }
}