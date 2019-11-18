output "dns_name" {
  value = "${aws_elb.dynamsoft_elb.0.dns_name}"
}

output "zone_id" {
  value = "${aws_elb.dynamsoft_elb.0.zone_id}"
}

output "cert_arn" {
  value = "${aws_acm_certificate.this.arn}"
}

output "resource_record_name" {
  value = "${aws_acm_certificate.this.domain_validation_options.0.resource_record_name}"
}

output "resource_record_type" {
  value = "${aws_acm_certificate.this.domain_validation_options.0.resource_record_type}"
}

output "resource_record_value" {
  value = "${aws_acm_certificate.this.domain_validation_options.0.resource_record_value}"
}