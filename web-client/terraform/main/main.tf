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
  dns_domain = "${var.dns_domain}"
  cloudfront_default_ttl = "${var.cloudfront_default_ttl}"
  cloudfront_max_ttl = "${var.cloudfront_max_ttl}"
}

provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias = "us-west-1"
}

data "aws_route53_zone" "zone" {
  name = "${var.dns_domain}."
}


module "dynamsoft_us_east" {
  source = "../dynamsoft"

  environment = "${var.environment}"
  dns_domain = "${var.dns_domain}"
  providers = {
    aws = "aws.us-east-1"
  }
  ami = "ami-0a313d6098716f372"
  availability_zones = ["us-east-1a"]

}

module "dynamsoft_us_west" {
  source = "../dynamsoft"

  environment = "${var.environment}"
  dns_domain = "${var.dns_domain}"
  providers = {
    aws = "aws.us-west-1"
  }
  ami = "ami-06397100adf427136"
  availability_zones = ["us-west-1a"]
}


# resource "aws_route53_record" "dynamsoft_record_east" {
#   zone_id = "${data.aws_route53_zone.zone.zone_id}"
#   name    = "dynamsoft-${var.environment}.${var.dns_domain}"
#   type    = "A"

#   alias {
#     name                   = "${module.dynamsoft_us_east.dns_name}"
#     zone_id                = "${module.dynamsoft_us_east.zone_id}"
#     evaluate_target_health = true
#   }
# }


# resource "aws_route53_record" "dynamsoft_record_west" {
#   zone_id = "${data.aws_route53_zone.zone.zone_id}"
#   name    = "dynamsoft-${var.environment}.${var.dns_domain}"
#   type    = "A"

#   alias {
#     name                   = "${module.dynamsoft_us_west.dns_name}"
#     zone_id                = "${module.dynamsoft_us_west.zone_id}"
#     evaluate_target_health = true
#   }
# }
