resource "aws_sqs_queue" "virus_scan_queue" {
  name                       = "virus_scan_queue_${var.environment}"
  visibility_timeout_seconds = "900"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.virus_scan_dl_queue.arn
    maxReceiveCount     = 10
  })

    policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:*:*:virus_scan_queue_${var.environment}",
      "Condition": {
        "ArnEquals": { "aws:SourceArn": "${aws_s3_bucket.quarantine_us_east_1.arn}" }
      }
    }
  ]
}
POLICY
}

resource "aws_sqs_queue" "virus_scan_dl_queue" {
  name = "virus_scan_dl_queue_${var.environment}"
}

resource "aws_sqs_queue" "virus_scan_failure_queue" {
  name = "virus_scan_failure_queue_${var.environment}"
}
