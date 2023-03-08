resource "aws_sqs_queue" "migration_segments_queue" {
  name                       = "migration_segments_queue_${var.environment}"
  visibility_timeout_seconds = "900"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.migration_segments_dl_queue.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "migration_segments_dl_queue" {
  name = "migration_segments_dl_queue_${var.environment}"
}

resource "aws_sqs_queue" "migration_failure_queue" {
  name = "migration_failure_queue_${var.environment}"
}
