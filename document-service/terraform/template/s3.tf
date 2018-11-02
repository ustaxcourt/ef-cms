provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias = "us-west-1"
}

resource "aws_s3_bucket" "deployment_us_east_1" {
  bucket = "gov.ustaxcourt.ef-cms.apis.${var.environment}.us-east-1.deploys"
  acl = "private"
  provider = "aws.us-east-1"
  region = "us-east-1"

  tags {
    environment = "${var.environment}"
  }
}


resource "aws_s3_bucket" "deployment_us_east_2" {
  provider = "aws.us-west-1"
  region = "us-west-1"
  bucket = "gov.ustaxcourt.ef-cms.apis.${var.environment}.us-west-1.deploys"
  acl = "private"

  tags {
    environment = "${var.environment}"
  }
}