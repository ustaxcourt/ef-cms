data "aws_route53_zone" "zone" {
  name         = "${var.zone_name}."
  private_zone = "false"
}
