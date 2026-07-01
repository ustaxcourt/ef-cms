resource "aws_cognito_identity_pool" "rum_identity_pool" {
  identity_pool_name               = "${var.environment}-rum-identity-pool"
  allow_unauthenticated_identities = true
}

resource "aws_iam_role" "rum_unauthenticated_role" {
  name = "rum_unauthenticated_role_${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.rum_identity_pool.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" : "unauthenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "rum_permissions" {
  name = "${var.environment}-rum-permissions"
  role = aws_iam_role.rum_unauthenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "rum:PutRumEvents"
        Resource = aws_rum_app_monitor.app_monitor.arn
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "rum_roles" {
  identity_pool_id = aws_cognito_identity_pool.rum_identity_pool.id

  roles = {
    "unauthenticated" = aws_iam_role.rum_unauthenticated_role.arn
  }
}

resource "aws_rum_app_monitor" "app_monitor" {
  name   = "${var.environment}_dawson_rum_app_monitor"
  domain = "*.${var.domain}"
  app_monitor_configuration {
    allow_cookies       = true
    session_sample_rate = var.sample_rate
    telemetries         = ["performance"]
    identity_pool_id    = aws_cognito_identity_pool.rum_identity_pool.id
  }
  custom_events {
    status = "DISABLED"
  }
}

# The public app (deploy-public.sh) reports to its own monitor, separate from the
# client/private app monitor above. It gets its own Cognito identity pool and
# unauthenticated role so the two apps' RUM access is isolated.
resource "aws_cognito_identity_pool" "rum_identity_pool_public" {
  identity_pool_name               = "${var.environment}-public-rum-identity-pool"
  allow_unauthenticated_identities = true
}

resource "aws_iam_role" "rum_unauthenticated_role_public" {
  name = "rum_unauthenticated_role_public_${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.rum_identity_pool_public.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" : "unauthenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "rum_permissions_public" {
  name = "${var.environment}-public-rum-permissions"
  role = aws_iam_role.rum_unauthenticated_role_public.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "rum:PutRumEvents"
        Resource = aws_rum_app_monitor.public_app_monitor.arn
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "rum_roles_public" {
  identity_pool_id = aws_cognito_identity_pool.rum_identity_pool_public.id

  roles = {
    "unauthenticated" = aws_iam_role.rum_unauthenticated_role_public.arn
  }
}

resource "aws_rum_app_monitor" "public_app_monitor" {
  name   = "${var.environment}_dawson_public_rum_app_monitor"
  domain = "*.${var.domain}"
  app_monitor_configuration {
    allow_cookies       = true
    session_sample_rate = var.sample_rate
    telemetries         = ["performance"]
    identity_pool_id    = aws_cognito_identity_pool.rum_identity_pool_public.id
  }
  custom_events {
    status = "DISABLED"
  }
}

data "aws_caller_identity" "current" {}

# Private bucket that holds JavaScript source maps so CloudWatch RUM can
# unminify error stack traces. Maps are uploaded per release at
# s3://<bucket>/<releaseId>/index.[hash].js.map by deploy-ui.sh. The bucket must
# be in the same region as the app monitor (us-east-1).
resource "aws_s3_bucket" "rum_sourcemaps" {
  bucket        = "rum-sourcemaps.${var.domain}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "rum_sourcemaps" {
  bucket                  = aws_s3_bucket.rum_sourcemaps.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Expire old releases' source maps so the bucket does not grow unbounded.
resource "aws_s3_bucket_lifecycle_configuration" "rum_sourcemaps" {
  bucket = aws_s3_bucket.rum_sourcemaps.id

  rule {
    id     = "expire-old-source-maps"
    status = "Enabled"

    filter {}

    expiration {
      # CloudWatch RUM deobfuscates on-demand at view time by fetching the map
      # from S3, so sourcemaps must remain available for as long as any event
      # referencing them could still be visible in the console.
      #
      # Worst-case timeline for a single release:
      #   Day  0: deploy → sourcemaps uploaded, release goes live
      #   Day 29: a user hits an error (release still live, no new deploy yet)
      #   Day 30: RUM retains that event for 30 days → visible until day 59
      #
      # Therefore the map must outlive day 59. 60 days is the safe upper bound:
      # 30 days of possible event creation after the deploy + 30 days of RUM
      # retention for the last event created.
      days = 60
    }
  }
}

# Allow the CloudWatch RUM service to read source maps from this bucket, scoped
# to this account and app monitor (guards against the confused-deputy problem).
resource "aws_s3_bucket_policy" "rum_sourcemaps" {
  bucket = aws_s3_bucket.rum_sourcemaps.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "RUMServiceS3ReadPermissions"
        Effect    = "Allow"
        Principal = { Service = "rum.amazonaws.com" }
        Action    = ["s3:GetObject", "s3:ListBucket"]
        Resource = [
          aws_s3_bucket.rum_sourcemaps.arn,
          "${aws_s3_bucket.rum_sourcemaps.arn}/*",
        ]
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
            "aws:SourceArn" = [
              aws_rum_app_monitor.app_monitor.arn,
              aws_rum_app_monitor.public_app_monitor.arn,
            ]
          }
        }
      },
    ]
  })
}
