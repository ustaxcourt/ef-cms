output "dns_name" {
  value = element(concat(aws_elb.dynamsoft_elb.*.dns_name, tolist([""])), 0)
}

output "cert_arn" {
  value = aws_acm_certificate.this.arn
}

output "domain_validation_options" {
  value = aws_acm_certificate.this.domain_validation_options
}
