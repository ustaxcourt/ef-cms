resource "aws_sqs_queue" "calendar_trial_session_queue" {
  name                       = "calendar_trial_session_queue_${var.environment}_${var.current_color}"
  visibility_timeout_seconds = "30"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.calendar_trial_session_dl_queue.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "calendar_trial_session_dl_queue" {
  name = "calendar_trial_session_dl_queue${var.environment}_${var.current_color}"
}


resource "aws_sqs_queue" "send_emails_queue" {
  name                        = "send_emails_queue_${var.environment}_${var.current_color}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = "30"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.send_emails_dl_queue.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "send_emails_dl_queue" {
  name       = "send_emails_dl_queue_${var.environment}_${var.current_color}.fifo"
  fifo_queue = true
}

resource "aws_cloudwatch_metric_alarm" "send_emails_dl_queue_check" {
  alarm_name          = "${var.environment}_${var.current_color} send emails dl queue check"
  alarm_description   = "Alarm that triggers when a message is sent to this dl queue: ${resource.send_emails_dl_queue.sqs_queue_name}"
  namespace           = "AWS/SQS"
  metric_name         = "NumberOfMessagesSent"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 2
  period              = 120

  dimensions = {
    "QueueName": resource.send_emails_dl_queue.sqs_queue_name
  }

  alarm_actions       = [data.aws_sns_topic.system_health_alarms.arn]
}

