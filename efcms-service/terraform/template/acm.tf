module "efcms-api-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate"

  domain_name            = "efcms-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "efcms-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for efcms-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
}

module "efcms-api-certificate-us-west-1" {
  source = "github.com/traveloka/terraform-aws-acm-certificate"

  domain_name            = "efcms-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "efcms-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for efcms-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
  providers {
    aws = "aws.us-west-1"
  }
}
