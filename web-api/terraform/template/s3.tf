provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-east-2"
  alias = "us-east-2"
}

provider "aws" {
  region = "us-west-1"
  alias = "us-west-1"
}

resource "aws_s3_bucket" "deployment_us_east_1" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.deploys"
  acl = "private"
  provider = "aws.us-east-1"
  region = "us-east-1"

  tags = {
    environment = var.environment
  }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "deployment_us_west_2" {
  provider = aws.us-west-1
  region = "us-west-1"
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.deploys"
  acl = "private"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket" "documents_us_east_1" {
  provider = "aws.us-east-1"
  region = "us-east-1"
  bucket = "${var.dns_domain}-documents-${var.environment}-us-east-1"
  acl = "private"

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

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "documents_us_west_1" {
  provider = aws.us-west-1
  region = "us-west-1"
  bucket = "${var.dns_domain}-documents-${var.environment}-us-west-1"
  acl = "private"

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
  bucket = aws_s3_bucket.documents_us_west_1.id
  provider = aws.us-west-1
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "temp_documents_us_east_1" {
  provider = "aws.us-east-1"
  region = "us-east-1"
  bucket = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
  acl = "private"

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

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "temp_documents_us_west_1" {
  provider = aws.us-west-1
  region = "us-west-1"
  bucket = "${var.dns_domain}-temp-documents-${var.environment}-us-west-1"
  acl = "private"

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
  bucket = aws_s3_bucket.temp_documents_us_west_1.id
  provider = aws.us-west-1
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}