resource "aws_sqs_queue" "calendar_trial_session_queue" {
  name                        = "calendar_trial_session_queue_${var.environment}_${var.current_color}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = "30"
}

resource "aws_sqs_queue" "send_emails_queue" {
  name                        = "send_emails_queue_${var.environment}_${var.current_color}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = "30"
}

