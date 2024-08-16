
resource "aws_cloudwatch_log_metric_filter" "pdf_parse_error_filter" {
  name           = "PDFParseErrorFilter_${var.environment}_${var.current_color}"
  log_group_name = "/aws/lambda/api_async_${var.environment}_${var.current_color}"
  pattern        = "\"Failed to parse PDF\""

  metric_transformation {
    name      = "PDFParseErrors_${var.environment}_${var.current_color}"
    namespace = "EFCMS"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "pdf_parse_error_alarm" {
  alarm_name          = "PDFParseErrorAlarm_${var.environment}_${var.current_color}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = aws_cloudwatch_log_metric_filter.pdf_parse_error_filter.metric_transformation[0].name
  namespace           = aws_cloudwatch_log_metric_filter.pdf_parse_error_filter.metric_transformation[0].namespace
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"

  alarm_actions = [var.alert_sns_topic_arn]
}
