resource "aws_cloudwatch_metric_alarm" "failover_has_occurred_alarm" {
  alarm_name          = "Failover Alarm"
  alarm_description   = "If this alarm is going off a regional failover is occurring"
  comparison_operator = "LessThanThreshold"
  count               = var.enable_health_checks
  threshold           = "1"
  evaluation_periods  = "2"

  metric_query {
    id          = "eastErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = aws_route53_health_check.failover_health_check_east[0].id
      }
      metric_name = "HealthCheckStatus"
      namespace   = "AWS/Route53"
      period      = "60"
      stat        = "Minimum"
    }
  }

  metric_query {
    id          = "westErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = aws_route53_health_check.failover_health_check_west[0].id
      }
      metric_name = "HealthCheckStatus"
      namespace   = "AWS/Route53"
      period      = "60"
      stat        = "Minimum"
    }
  }

  metric_query {
    expression  = "AVG(METRICS())"
    id          = "allErrorsAveraged"
    return_data = true
  }

  alarm_actions             = [var.alert_sns_topic_arn]
  insufficient_data_actions = [var.alert_sns_topic_arn]
  ok_actions                = [var.alert_sns_topic_arn]
}

resource "aws_route53_health_check" "failover_health_check_east" {
  // fqdn must be a fully qualified domain name, and the invoke_url is not a domain but a url.
  // Therefore, we are addding the stage ("/exp1") to the resource path, and omitting ("https://") from the fqdn
  // e.g: https://6oz2qiqb7h.execute-api.us-east-1.amazonaws.com/exp1 --> 6oz2qiqb7h.execute-api.us-east-1.amazonaws.com
  reference_name     = "${var.environment} East Health Check"
  fqdn               = "example.com" // This will be updated by a script switch-health-check-domain.ts
  port               = 443
  type               = "HTTPS_STR_MATCH"
  resource_path      = "${var.environment}/public-api/cached-health"
  failure_threshold  = "3"
  request_interval   = "30"
  count              = var.enable_health_checks
  invert_healthcheck = false
  disabled           = true
  search_string      = "true"                                  # Search for a JSON property returning "true"; fail check if not present
  regions            = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
  lifecycle {
    ignore_changes = [fqdn, disabled]
  }
}

resource "aws_route53_health_check" "failover_health_check_west" {
  // fqdn must be a fully qualified domain name, and the invoke_url is not a domain but a url.
  // Therefore, we are addding the stage ("/exp1") to the resource path, and omitting ("https://") from the fqdn
  // e.g: https://6oz2qiqb7h.execute-api.us-east-1.amazonaws.com/exp1 --> 6oz2qiqb7h.execute-api.us-east-1.amazonaws.com
  reference_name     = "${var.environment} West Health Check"
  fqdn               = "example.com"
  port               = 443
  type               = "HTTPS_STR_MATCH"
  resource_path      = "${var.environment}/public-api/cached-health"
  failure_threshold  = "3"
  request_interval   = "30"
  count              = var.enable_health_checks
  invert_healthcheck = false
  disabled           = true
  search_string      = "true"                                  # Search for a JSON property returning "true"; fail check if not present
  regions            = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
  lifecycle {
    // Ignoring these two properties as they will be managed by the switch-health-check-domain.ts script during switch-colors
    ignore_changes = [fqdn, disabled]
  }
}

resource "aws_ssm_parameter" "east_health_check_id_ssm" {
  count = var.enable_health_checks
  name  = "terraform-${var.environment}-us-east-1-health-check-id"
  type  = "String"
  value = aws_route53_health_check.failover_health_check_east[0].id
}
resource "aws_ssm_parameter" "west_health_check_id_ssm" {
  count = var.enable_health_checks
  name  = "terraform-${var.environment}-us-west-1-health-check-id"
  type  = "String"
  value = aws_route53_health_check.failover_health_check_west[0].id
}

