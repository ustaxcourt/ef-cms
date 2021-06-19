provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "3.42.0"
  }
}

module "environment" {
  source = "../common"

  zone_name              = var.zone_name
  environment            = var.environment
  dns_domain             = var.dns_domain
  cloudfront_default_ttl = var.cloudfront_default_ttl
  cloudfront_max_ttl     = var.cloudfront_max_ttl

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

data "aws_route53_zone" "zone" {
  name = "${var.zone_name}."
}

module "dynamsoft_us_east" {
  source = "../dynamsoft"

  environment = var.environment
  dns_domain  = var.dns_domain
  providers = {
    aws = aws.us-east-1
  }
  zone_name              = var.zone_name
  ami                    = "ami-0a313d6098716f372"
  availability_zones     = ["us-east-1a"]
  is_dynamsoft_enabled   = var.is_dynamsoft_enabled
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}

module "dynamsoft_us_west" {
  source = "../dynamsoft"

  environment = var.environment
  dns_domain  = var.dns_domain
  providers = {
    aws = aws.us-west-1
  }
  zone_name              = var.zone_name
  ami                    = "ami-06397100adf427136"
  availability_zones     = ["us-west-1a"]
  is_dynamsoft_enabled   = var.is_dynamsoft_enabled
  dynamsoft_s3_zip_path  = var.dynamsoft_s3_zip_path
  dynamsoft_url          = var.dynamsoft_url
  dynamsoft_product_keys = var.dynamsoft_product_keys
}


resource "aws_route53_record" "record_certs" {
  for_each = {
    for dvo in module.dynamsoft_us_east.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}


resource "aws_route53_record" "record_east_www" {
  name           = "dynamsoft-lib.${var.dns_domain}"
  type           = "CNAME"
  zone_id        = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-east-1"
  count          = var.is_dynamsoft_enabled
  records = [
    module.dynamsoft_us_east.dns_name,
  ]
  latency_routing_policy {
    region = "us-east-1"
  }
  ttl = 60
}

resource "aws_route53_record" "record_west_www" {
  name           = "dynamsoft-lib.${var.dns_domain}"
  type           = "CNAME"
  zone_id        = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-west-1"
  count          = var.is_dynamsoft_enabled
  records = [
    module.dynamsoft_us_west.dns_name
  ]
  latency_routing_policy {
    region = "us-west-1"
  }
  ttl = 60
}

resource "aws_acm_certificate_validation" "dns_validation_east" {
  certificate_arn         = module.dynamsoft_us_east.cert_arn
  validation_record_fqdns = [for record in aws_route53_record.record_certs : record.fqdn]
  provider                = aws.us-east-1
}

resource "aws_acm_certificate_validation" "dns_validation_west" {
  certificate_arn         = module.dynamsoft_us_west.cert_arn
  validation_record_fqdns = [for record in aws_route53_record.record_certs : record.fqdn]
  provider                = aws.us-west-1
}

resource "aws_route53_record" "statuspage" {
  count   = var.statuspage_dns_record != "" ? 1 : 0
  name    = "status.${var.dns_domain}"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  ttl     = 60
  records = [
    var.statuspage_dns_record
  ]
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

resource "aws_cloudwatch_metric_alarm" "public_ui_health_check" {
  alarm_name          = "${var.dns_domain} is accessible over HTTPS"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"

  dimensions = {
    HealthCheckId = aws_route53_health_check.public_ui_health_check.id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "public_ui_health_check" {
  fqdn              = var.dns_domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "3"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}

resource "aws_cloudwatch_metric_alarm" "ui_health_check" {
  alarm_name          = "app.${var.dns_domain} is accessible over HTTPS"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"

  dimensions = {
    HealthCheckId = aws_route53_health_check.ui_health_check.id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "ui_health_check" {
  fqdn              = "app.${var.dns_domain}"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "3"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}

resource "aws_cloudwatch_metric_alarm" "status_health_check" {
  alarm_name          = "${var.dns_domain} health check endpoint"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"

  dimensions = {
    HealthCheckId = aws_route53_health_check.status_health_check.id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "status_health_check" {
  fqdn               = "public-api.${var.dns_domain}"
  port               = 443
  type               = "HTTPS_STR_MATCH"
  resource_path      = "/public-api/health"
  failure_threshold  = "3"
  request_interval   = "30"
  invert_healthcheck = true
  search_string      = "false"                                 # Search for any JSON property returning "false"
  regions            = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}
