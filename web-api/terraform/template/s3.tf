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

  tags = {
    environment = var.environment
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
}

resource "aws_s3_bucket_public_access_block" "block_quarantine_west" {
  bucket                  = aws_s3_bucket.quarantine_us_west_1.id
  provider                = aws.us-west-1
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

