data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "allow_access_for_email_smoketests" {
  count  = var.environment == "prod" ? 0 : 1
  bucket = aws_s3_bucket.smoketest_email_inbox[0].bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowSESPuts"
        Effect    = "Allow"
        Principal = { Service = "ses.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "arn:aws:s3:::${aws_s3_bucket.smoketest_email_inbox[0].bucket}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = "${data.aws_caller_identity.current.account_id}"
            "AWS:SourceArn"     = "arn:aws:ses:us-east-1:${data.aws_caller_identity.current.account_id}:receipt-rule-set/email_forwarding_rule_set:receipt-rule/email_forwarding_rule_${var.environment}"
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket" "smoketest_email_inbox" {
  count    = var.environment == "prod" ? 0 : 1
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-email-inbox-${var.environment}-us-east-1"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "smoketest_email_inbox_sse" {
  bucket = aws_s3_bucket.smoketest_email_inbox[0].id
  count  = var.environment == "prod" ? 0 : 1

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
