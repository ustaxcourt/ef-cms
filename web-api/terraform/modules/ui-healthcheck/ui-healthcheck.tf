data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

resource "aws_cloudwatch_metric_alarm" "ui_health_check" {
  alarm_name          = var.alarm_name 
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
  fqdn              = var.dns_domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "3"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}
