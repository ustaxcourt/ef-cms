resource "aws_cloudwatch_metric_alarm" "send_emails_dl_queue_check" {
  alarm_name          = "${var.environment}_${var.deploying_color} send emails dl queue check"
  alarm_description   = "Alarm that triggers when a message is sent to this dl queue: ${aws_sqs_queue.send_emails_dl_queue.name}"
  namespace           = "AWS/SQS"
  metric_name         = "NumberOfMessagesSent"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 1
  period              = 300

  dimensions = {
    "QueueName"  = "send_emails_dl_queue_${var.environment}_${var.deploying_color}.fifo"
  }

  alarm_actions       = [data.aws_sns_topic.system_health_alarms.arn]
}
