data "aws_route53_zone" "zone" {
  name         = var.hosted_zone_name
  private_zone = "false"
}
