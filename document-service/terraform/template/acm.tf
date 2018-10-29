module "documents-api-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate"

  domain_name            = "documents-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "documents-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for documents-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
}

module "documents-api-certificate-us-east-2" {
  source = "github.com/traveloka/terraform-aws-acm-certificate"

  domain_name            = "documents-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "documents-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for documents-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
  providers {
    aws = "aws.us-east-2"
  }
}
