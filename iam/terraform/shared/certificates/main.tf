resource "aws_acm_certificate" "this" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.subject_alternative_names

  tags = {
    Name          = var.certificate_name
    ProductDomain = var.product_domain
    Environment   = var.environment
    Description   = var.description
    ManagedBy     = "terraform"
  }
}

resource "aws_route53_record" "this" {
  allow_overwrite = true
  name            = aws_acm_certificate.this.domain_validation_options.0.resource_record_name
  records         = [aws_acm_certificate.this.domain_validation_options.0.resource_record_value]
  ttl             = 60
  type            = aws_acm_certificate.this.domain_validation_options.0.resource_record_type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_acm_certificate_validation" "dns_validation" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [aws_route53_record.this.fqdn]
}
