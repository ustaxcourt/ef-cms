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
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_acm_certificate_validation" "dns_validation" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for record in aws_route53_record.this : record.fqdn]
}

# resource "aws_route53_record" "this" {
#   name    = aws_acm_certificate.this.domain_validation_options.0.resource_record_name
#   type    = aws_acm_certificate.this.domain_validation_options.0.resource_record_type
#   zone_id = data.aws_route53_zone.zone.id
#   records = [aws_acm_certificate.this.domain_validation_options.0.resource_record_value]
#   ttl     = 60
# }

# resource "aws_acm_certificate_validation" "dns_validation" {
#   certificate_arn         = aws_acm_certificate.this.arn
#   validation_record_fqdns = [aws_route53_record.this.fqdn]
# }
