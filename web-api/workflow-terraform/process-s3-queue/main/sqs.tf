resource "aws_sqs_queue" "s3_bucket_queue" {
  name                       = "s3_bucket_${var.environment}_${var.bucket_short_name}_queue"
  visibility_timeout_seconds = "900"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.s3_bucket_dl_queue.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "s3_bucket_dl_queue" {
  name = "s3_bucket_${var.environment}_${var.bucket_short_name}_dl_queue"
}
