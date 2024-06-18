resource "aws_s3_bucket" "temp_documents_us_east_1" {
  provider = aws.us-east-1
  bucket   = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "temp_documents_east_ownership_controls" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_cors_configuration" "temp_documents_s3_cors_us_east_1" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "temp_documents_s3_lc_us_east_1" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id

  rule {
    id     = "remove_temp_documents_rule"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_versioning" "temp_documents_s3_versioning_us_east_1" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "temp_documents_sse_us_east_1" {
  bucket = aws_s3_bucket.temp_documents_us_east_1.id

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
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

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "temp_documents_west_ownership_controls" {
  provider = aws.us-west-1
  bucket = aws_s3_bucket.temp_documents_us_west_1.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_cors_configuration" "temp_documents_s3_cors_us_west_1" {
  bucket   = aws_s3_bucket.temp_documents_us_west_1.id
  provider = aws.us-west-1

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "temp_documents_s3_lc_us_west_1" {
  bucket   = aws_s3_bucket.temp_documents_us_west_1.id
  provider = aws.us-west-1

  rule {
    id     = "remove_temp_documents_rule"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_versioning" "temp_documents_s3_versioning_us_west_1" {
  bucket   = aws_s3_bucket.temp_documents_us_west_1.id
  provider = aws.us-west-1

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "temp_documents_sse_us_west_1" {
  bucket   = aws_s3_bucket.temp_documents_us_west_1.id
  provider = aws.us-west-1

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
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
