output "dns_name" {
  value = "${aws_elb.dynamsoft_elb.dns_name}"
}

output "zone_id" {
  value = "${aws_elb.dynamsoft_elb.zone_id}"
}