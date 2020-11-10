resource "aws_sqs_queue" "migrate_legacy_documents_segments_queue" {
  name                       = "migrate_legacy_documents_segments_queue_${var.environment}"
  visibility_timeout_seconds = "70"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.migrate_legacy_documents_segments_dl_queue.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "migrate_legacy_documents_segments_dl_queue" {
  name = "migrate_legacy_documents_segments_dl_queue_${var.environment}"
}

resource "aws_sqs_queue" "migrate_legacy_documents_failure_queue" {
  name = "migrate_legacy_documents_failure_queue_${var.environment}"
}
