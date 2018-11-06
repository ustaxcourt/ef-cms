data "aws_route53_zone" "aws_route53_zone" {
  name = "${var.dns_domain}."
}