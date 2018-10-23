data "aws_region" "current" {}

resource "aws_s3_bucket" "deployment" {
  bucket = "gov.ustaxcourt.ef-cms.apis.${var.environment}.${data.aws_region.current.name}.deploys"

  acl = "private"

  tags {
    environment = "${var.environment}"
  }
}