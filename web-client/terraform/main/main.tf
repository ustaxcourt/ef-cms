provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }
}

module "environment" {
  source = "../common"

  environment = var.environment
  dns_domain = var.dns_domain
  cloudfront_default_ttl = var.cloudfront_default_ttl
  cloudfront_max_ttl = var.cloudfront_max_ttl
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

  environment = var.environment
  dns_domain = var.dns_domain
  providers = {
    aws = "aws.us-east-1"
  }
  ami = "ami-0a313d6098716f372"
  availability_zones = ["us-east-1a"]
  is_dynamsoft_enabled = var.is_dynamsoft_enabled
  dynamsoft_s3_zip_path = var.dynamsoft_s3_zip_path
  dynamsoft_url = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}

module "dynamsoft_us_west" {
  source = "../dynamsoft"

  environment = var.environment
  dns_domain = var.dns_domain
  providers = {
    aws = aws.us-west-1
  }
  ami = "ami-06397100adf427136"
  availability_zones = ["us-west-1a"]
  is_dynamsoft_enabled = var.is_dynamsoft_enabled
  dynamsoft_s3_zip_path = var.dynamsoft_s3_zip_path
  dynamsoft_url = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}


resource "aws_route53_record" "record_certs" {
  name    = module.dynamsoft_us_east.resource_record_name
  type    = module.dynamsoft_us_east.resource_record_type
  zone_id = data.aws_route53_zone.zone.zone_id
  records = [
    module.dynamsoft_us_east.resource_record_value,
  ]
  ttl     = 60
}


resource "aws_route53_record" "record_east_www" {
  name    = "dynamsoft-lib-${var.environment}.${var.dns_domain}"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-east-1"
  count = var.is_dynamsoft_enabled
  records = [
    module.dynamsoft_us_east.dns_name,
  ]
  latency_routing_policy = {
    region = "us-east-1"
  }
  ttl     = 60
}

resource "aws_route53_record" "record_west_www" {
  name    = "dynamsoft-lib-${var.environment}.${var.dns_domain}"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-west-1"
  count = var.is_dynamsoft_enabled
  records = [
    module.dynamsoft_us_west.dns_name
  ]
  latency_routing_policy = {
    region = "us-west-1"
  }
  ttl     = 60
}

resource "aws_acm_certificate_validation" "dns_validation_east" {
  certificate_arn         = module.dynamsoft_us_east.cert_arn
  validation_record_fqdns = [aws_route53_record.record_certs.fqdn]
  provider = "aws.us-east-1"
}

resource "aws_acm_certificate_validation" "dns_validation_west" {
  certificate_arn         = module.dynamsoft_us_west.cert_arn
  validation_record_fqdns = [aws_route53_record.record_certs.fqdn]
  provider = aws.us-west-1
}
