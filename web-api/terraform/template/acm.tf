
data "aws_route53_zone" "zone" {
  name         = "${var.zone_name}."
  private_zone = "false"
}

resource "aws_acm_certificate" "us-east-1" {
  domain_name       = "app.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "app.${var.dns_domain}"
    ProductDomain = "EFCMS"
    Environment   = var.environment
    Description   = "Certificate for app.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "dns_validation-us-east-1" {
  certificate_arn         = aws_acm_certificate.us-east-1.arn
  validation_record_fqdns = [aws_route53_record.record.fqdn]
}

resource "aws_acm_certificate" "us-west-1" {
  domain_name       = "app.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "app.${var.dns_domain}"
    ProductDomain = "EFCMS"
    Environment   = var.environment
    Description   = "Certificate for app.${var.dns_domain} on us-west-1"
    ManagedBy     = "terraform"
  }

  provider = aws.us-west-1
}

resource "aws_route53_record" "record" {
  name    = aws_acm_certificate.us-east-1.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.us-east-1.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.id
  records = [
    aws_acm_certificate.us-east-1.domain_validation_options.0.resource_record_value,
  ]
  ttl = 60
}

resource "aws_acm_certificate_validation" "dns_validation-us-west-1" {
  certificate_arn         = aws_acm_certificate.us-west-1.arn
  validation_record_fqdns = [aws_route53_record.record.fqdn]
  provider                = aws.us-west-1
}

resource "aws_acm_certificate" "ws-us-east-1" {
  domain_name       = "ws.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "ws.${var.dns_domain}"
    ProductDomain = "EFCMS"
    Environment   = var.environment
    Description   = "Certificate for ws.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "ws-dns_validation-us-east-1" {
  certificate_arn         = aws_acm_certificate.ws-us-east-1.arn
  validation_record_fqdns = [aws_route53_record.ws-record.fqdn]
}

resource "aws_route53_record" "ws-record" {
  name    = aws_acm_certificate.ws-us-east-1.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.ws-us-east-1.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.id
  records = [
    aws_acm_certificate.ws-us-east-1.domain_validation_options.0.resource_record_value,
  ]
  ttl = 60
}

resource "aws_acm_certificate" "ws-us-west-1" {
  domain_name       = "ws.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "ws.${var.dns_domain}"
    ProductDomain = "EFCMS"
    Environment   = var.environment
    Description   = "Certificate for ws.${var.dns_domain}"
    ManagedBy     = "terraform"
  }

  provider = aws.us-west-1
}

resource "aws_acm_certificate_validation" "ws-dns_validation-us-west-1" {
  certificate_arn         = aws_acm_certificate.ws-us-west-1.arn
  validation_record_fqdns = [aws_route53_record.ws-record.fqdn]
  provider                = aws.us-west-1
}
