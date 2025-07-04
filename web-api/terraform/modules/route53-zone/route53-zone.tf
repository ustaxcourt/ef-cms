resource "aws_route53_zone" "primary" {
  name = "${var.dns_domain}"
}
