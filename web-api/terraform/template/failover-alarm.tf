resource "aws_cloudwatch_metric_alarm" "failover_has_occurred_alarm" {
  alarm_name          = "Failover Alarm"
  alarm_description   = "If this alarm is going off a regional failover is occurring"
  comparison_operator = "LessThanThreshold"
  count               = var.enable_health_checks
  threshold           = "1"
  evaluation_periods  = "2"

  metric_query {
    id          = "eastGreenErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = module.api-east-green.health_check_id
      }
      metric_name = "HealthCheckStatus"
      namespace   = "AWS/Route53"
      period      = "60"
      stat        = "Minimum"
    }
  }

  metric_query {
    id          = "eastBlueErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = module.api-east-blue.health_check_id
      }
      metric_name = "HealthCheckStatus"
      namespace   = "AWS/Route53"
      period      = "60"
      stat        = "Minimum"
    }
  }

  metric_query {
    id          = "westGreenErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = module.api-west-green.health_check_id
      }
      metric_name = "HealthCheckStatus"
      namespace   = "AWS/Route53"
      period      = "60"
      stat        = "Minimum"
    }
  }


  metric_query {
    id          = "westBlueErrors"
    return_data = false

    metric {
      dimensions = {
        HealthCheckId = module.api-west-blue.health_check_id
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
