resource "aws_route53_record" "statuspage" {
  name    = "status.${var.dns_domain}"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  ttl     = 60
  records = [
    var.statuspage_dns_record
  ]
}
