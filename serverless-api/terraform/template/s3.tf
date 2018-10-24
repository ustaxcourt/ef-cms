provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-east-2"
  alias = "us-east-2"
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
  provider = "aws.us-east-2"
  region = "us-east-2"
  bucket = "gov.ustaxcourt.ef-cms.apis.${var.environment}.us-east-2.deploys"
  acl = "private"

  tags {
    environment = "${var.environment}"
  }
}