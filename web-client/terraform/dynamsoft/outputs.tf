output "dns_name" {
  value = element(concat(aws_elb.dynamsoft_elb.*.dns_name, list("")), 0)
}

output "cert_arn" {
  value = aws_acm_certificate.this.arn
}

output "resource_record_name" {
  value = aws_acm_certificate.this.domain_validation_options.0.resource_record_name
}

output "resource_record_type" {
  value = aws_acm_certificate.this.domain_validation_options.0.resource_record_type
}

output "resource_record_value" {
  value = aws_acm_certificate.this.domain_validation_options.0.resource_record_value
}