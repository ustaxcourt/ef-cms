resource "aws_iam_role" "s3_replication_role" {
  name = "s3_bucket_replication_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "s3_replication_policy" {
  name = "s3_replication_policy_${var.environment}"
  role = aws_iam_role.s3_replication_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket" "documents_us_east_1" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-documents-${var.environment}-us-east-1"
  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "documents_east_ownership_controls" {
  bucket = aws_s3_bucket.documents_us_east_1.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_replication_configuration" "documents_s3_replication_us_east_1" {
  depends_on = [aws_s3_bucket_versioning.documents_s3_versioning_us_east_1]
  role       = aws_iam_role.s3_replication_role.arn
  bucket     = aws_s3_bucket.documents_us_east_1.id

  rule {
    id     = "duplicate all documents from east to west"
    status = "Enabled"
    destination {
      bucket        = aws_s3_bucket.documents_us_west_1.arn
      storage_class = "STANDARD"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "documents_s3_cors_us_east_1" {
  bucket = aws_s3_bucket.documents_us_east_1.id

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "documents_s3_lc_us_east_1" {
  bucket = aws_s3_bucket.documents_us_east_1.id

  rule {
    id     = "remove_paper_service_documents_rule"
    status = "Enabled"

    expiration {
      days = 3
    }

    filter {
      prefix = "paper-service-pdf/"
    }
  }
}

resource "aws_s3_bucket_versioning" "documents_s3_versioning_us_east_1" {
  bucket = aws_s3_bucket.documents_us_east_1.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "documents_sse_us_east_1" {
  bucket = aws_s3_bucket.documents_us_east_1.id

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_policy" "allow_access_for_glue_job" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = aws_s3_bucket.documents_us_east_1.bucket
  policy = data.aws_iam_policy_document.allow_access_for_glue_job.json
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

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "documents_west_ownership_controls" {
  bucket   = aws_s3_bucket.documents_us_west_1.id
  provider = aws.us-west-1
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_cors_configuration" "documents_s3_cors_us_west_1" {
  bucket = aws_s3_bucket.documents_us_west_1.id

  provider = aws.us-west-1

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "documents_s3_lc_us_west_1" {
  bucket   = aws_s3_bucket.documents_us_west_1.id
  provider = aws.us-west-1

  rule {
    id     = "remove_paper_service_documents_rule"
    status = "Enabled"

    expiration {
      days = 3
    }

    filter {
      prefix = "paper-service-pdf/"
    }
  }
}

resource "aws_s3_bucket_versioning" "documents_s3_versioning_us_west_1" {
  bucket   = aws_s3_bucket.documents_us_west_1.id
  provider = aws.us-west-1
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "documents_sse_us_west_1" {
  bucket   = aws_s3_bucket.documents_us_west_1.id
  provider = aws.us-west-1

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
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
