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
  alarm_name          = "efcms_${var.environment}_${var.current_color}: SendEmails-DLQueueCheck"
  alarm_description   = "Alarm that triggers when a message is sent to send_emails_dl_queue_${var.environment}_${var.current_color}.fifo"
  namespace           = "AWS/SQS"
  metric_name         = "NumberOfMessagesSent"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 1
  period              = 300

  dimensions = {
    QueueName = aws_sqs_queue.send_emails_dl_queue.name
  }

  alarm_actions = [var.alert_sns_topic_arn]
}
