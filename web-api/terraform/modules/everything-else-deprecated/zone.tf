data "aws_route53_zone" "zone" {
  name         = "${var.dns_domain}."
  private_zone = "false"
}
