data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "documents_us_east_1" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-documents-${var.environment}-us-east-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    environment = var.environment
  }

  lifecycle_rule {
    prefix  = "paper-service-pdf/"
    enabled = true

    expiration {
      days = 3
    }
  }

  replication_configuration {
    role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/s3_replication_role_${var.environment}"

    rules {
      status = "Enabled"
      prefix = ""

      destination {
        bucket        = aws_s3_bucket.documents_us_west_1.arn
        storage_class = "STANDARD"
      }
    }
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_policy" "allow_access_for_glue_job" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.documents_us_east_1.bucket
  policy = data.aws_iam_policy_document.allow_access_for_glue_job.json
}

resource "aws_s3_bucket_policy" "allow_access_for_email_smoketests" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.smoketest_email_inbox.bucket
  policy = data.aws_iam_policy_document.allow_access_for_email_smoketests.json
}

resource "aws_s3_bucket_policy" "allow_access_for_email_smoketests" {
  bucket = "${var.dns_domain}-email-test-${var.environment}-us-east-1"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowSESPuts"
        Effect    = "Allow"
        Principal = { Service = "ses.amazonaws.com" }
        Action    = "s3:PutObject"
        Resources = [
          "arn:aws:s3:::${var.dns_domain}-email-test-${var.environment}-us-east-1",
          "arn:aws:s3:::${var.dns_domain}-email-test-${var.environment}-us-east-1/*",
        ]
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = "111122223333"
            "AWS:SourceArn"     = "arn:aws:ses:region:${data.aws_caller_identity.current.account_id}:receipt-rule-set/rule_set_name:receipt-rule/receipt_rule_name"
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket" "smoketest_email_inbox" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-email-inbox-${var.environment}"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = false
  }

  tags = {
    environment = var.environment
  }
  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
data "aws_iam_policy_document" "allow_access_for_glue_job" {
  statement {
    sid = "DelegateS3Access"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${var.lower_env_account_id}:root"]
    }

    actions = [
      "s3:GetObject",
      "s3:GetObjectTagging",
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::${var.dns_domain}-documents-${var.environment}-us-east-1",
      "arn:aws:s3:::${var.dns_domain}-documents-${var.environment}-us-east-1/*",
    ]
  }
}

resource "aws_s3_bucket_public_access_block" "block_documents_east" {
  bucket = aws_s3_bucket.documents_us_east_1.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "documents_us_west_1" {
  provider = aws.us-west-1
  bucket   = "${var.dns_domain}-documents-${var.environment}-us-west-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  lifecycle_rule {
    prefix  = "paper-service-pdf/"
    enabled = true

    expiration {
      days = 3
    }
  }

  tags = {
    environment = var.environment
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_documents_west" {
  bucket                  = aws_s3_bucket.documents_us_west_1.id
  provider                = aws.us-west-1
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "temp_documents_us_east_1" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    environment = var.environment
  }

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_temp_east" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "temp_documents_us_west_1" {
  provider = aws.us-west-1
  bucket   = "${var.dns_domain}-temp-documents-${var.environment}-us-west-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    environment = var.environment
  }

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_temp_west" {
  bucket                  = aws_s3_bucket.temp_documents_us_west_1.id
  provider                = aws.us-west-1
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "quarantine_us_east_1" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    environment = var.environment
  }

  lifecycle_rule {
    enabled = true

    expiration {
      days = 7
    }
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_quarantine_east" {
  bucket = aws_s3_bucket.quarantine_us_east_1.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "quarantine_us_west_1" {
  provider = aws.us-west-1
  bucket   = "${var.dns_domain}-quarantine-${var.environment}-us-west-1"
  acl      = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    environment = var.environment
  }

  lifecycle_rule {
    enabled = true

    expiration {
      days = 1
    }
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_quarantine_west" {
  bucket                  = aws_s3_bucket.quarantine_us_west_1.id
  provider                = aws.us-west-1
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
