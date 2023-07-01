resource "aws_sqs_queue" "s3_bucket_objects_queue" {
  name                       = "s3_bucket_objects_queue_${var.environment}"
  visibility_timeout_seconds = "900"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.s3_bucket_objects_dl_queue.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "s3_bucket_objects_dl_queue" {
  name = "s3_bucket_objects_dl_queue_${var.environment}"
}
