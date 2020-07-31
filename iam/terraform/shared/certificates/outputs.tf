output "acm_certificate_arn" {
  description = "arn of acm certificate"
  value       = aws_acm_certificate.this.arn
}

output "acm_certificate_dns_validation_record" {
  description = "record which is used to validate acm certificate"
  value       = aws_route53_record.this.name
}

output "dns_validation" {
  description = "the dns validation record"
  value       = aws_acm_certificate_validation.dns_validation
}
