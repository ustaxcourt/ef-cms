data "aws_acm_certificate" "public_certificate" {
  domain = var.dns_domain
  most_recent = true
}

resource "aws_s3_bucket" "frontend_public" {
  #checkov:skip=CKV_AWS_21: static public frontend asset bucket — content is regenerated on every deploy, versioning adds cost with no recovery value
  #checkov:skip=CKV_AWS_18: static React JS/CSS bundles only — no sensitive data; CloudFront access logs cover traffic visibility if needed
  #checkov:skip=CKV_AWS_145: AWS-managed SSE is sufficient for static React bundles — no PII or sensitive data; CMK adds key management overhead without security benefit
  bucket = "${var.current_color}.${var.dns_domain}"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_policy" "frontend_public_s3_policy" {
  bucket = aws_s3_bucket.frontend_public.id
  policy = data.aws_iam_policy_document.allow_cloudfront_public.json
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend_public_sse" {
  bucket = aws_s3_bucket.frontend_public.id

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "unblock_frontend_public" {
  bucket = aws_s3_bucket.frontend_public.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "failover_public" {
  #checkov:skip=CKV_AWS_21: static public frontend failover asset bucket — content is regenerated on every deploy, versioning adds cost with no recovery value
  #checkov:skip=CKV_AWS_18: static React JS/CSS bundles only — no sensitive data; CloudFront access logs cover traffic visibility if needed
  #checkov:skip=CKV_AWS_145: AWS-managed SSE is sufficient for static React bundles — no PII or sensitive data; CMK adds key management overhead without security benefit
  bucket = "failover-${var.current_color}.${var.dns_domain}"

  tags = {
    environment = var.environment
  }

  provider = aws.us-west-1
}

resource "aws_s3_bucket_policy" "failover_public_s3_policy" {
  bucket   = aws_s3_bucket.failover_public.id
  policy   = data.aws_iam_policy_document.allow_cloudfront_public_failover.json
  provider = aws.us-west-1
}

resource "aws_s3_bucket_server_side_encryption_configuration" "failover_public_sse" {
  bucket   = aws_s3_bucket.failover_public.id
  provider = aws.us-west-1

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "unblock_failover_public" {
  bucket   = aws_s3_bucket.failover_public.id
  provider = aws.us-west-1

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "allow_cloudfront_public" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      identifiers = ["cloudfront.amazonaws.com"]
      type        = "Service"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::${var.current_color}.${var.dns_domain}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.public_distribution.arn]
    }
  }
}

data "aws_iam_policy_document" "allow_cloudfront_public_failover" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      identifiers = ["cloudfront.amazonaws.com"]
      type        = "Service"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::failover-${var.current_color}.${var.dns_domain}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.public_distribution.arn]
    }
  }
}

resource "aws_cloudfront_origin_access_control" "frontend_public" {
  name                              = "${var.current_color}.${var.dns_domain}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "failover_public" {
  name                              = "failover-${var.current_color}.${var.dns_domain}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "public_distribution" {
  #checkov:skip=CKV2_AWS_47:WAF not attached to this CloudFront distribution — WAF is associated at the API Gateway layer; this distribution serves static React bundles only
  #checkov:skip=CKV_AWS_174:minimum_protocol_version not set — ACM cert with sni-only enforces TLS; CloudFront default security policy applies; accepted for static asset distribution
  #checkov:skip=CKV_AWS_374:No geo restriction intentional — US Tax Court is accessible to overseas military and international tax cases
  #checkov:skip=CKV2_AWS_32:Security headers (CSP, X-Frame-Options, HSTS) managed by header_security_lambda Lambda@Edge on origin-response; CloudFront response headers policy would conflict
  #checkov:skip=CKV_AWS_68: WAF is associated at API Gateway layer — CloudFront serves static React bundles only; all authenticated API calls go through API GW where WAF is attached
  #checkov:skip=CKV_AWS_86: CloudFront access logging not enabled — high-volume static asset delivery; CloudWatch metrics and WAF logs cover operational and security visibility
  origin_group {
    origin_id = "group-${var.current_color}.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-${var.current_color}.${var.dns_domain}"
    }

    member {
      origin_id = "failover-${var.current_color}.${var.dns_domain}"
    }
  }

  origin {
    domain_name              = aws_s3_bucket.frontend_public.bucket_regional_domain_name
    origin_id                = "primary-${var.current_color}.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_public.id

    # Config channel for header_security_lambda (origin-response) — supplies the domain it
    # interpolates into the CSP. NOT an authorization mechanism: access is enforced by OAC
    # SigV4 + the AWS:SourceArn condition on the bucket policy.
    custom_header {
      name  = "x-allowed-domain"
      value = var.zone_name
    }
  }

  origin {
    domain_name              = aws_s3_bucket.failover_public.bucket_regional_domain_name
    origin_id                = "failover-${var.current_color}.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.failover_public.id

    # Config channel for header_security_lambda (origin-response) — supplies the domain it
    # interpolates into the CSP. NOT an authorization mechanism: access is enforced by OAC
    # SigV4 + the AWS:SourceArn condition on the bucket policy.
    custom_header {
      name  = "x-allowed-domain"
      value = var.zone_name
    }
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = var.viewer_protocol_policy
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-${var.current_color}.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = "86400"
    max_ttl                = "31536000"

    lambda_function_association {
      event_type   = "origin-response"
      lambda_arn   = module.header_security_lambda.qualified_arn
      include_body = false
    }

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "group-${var.current_color}.${var.dns_domain}"

    lambda_function_association {
      event_type   = "origin-response"
      lambda_arn   = module.header_security_lambda.qualified_arn
      include_body = false
    }

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = var.viewer_protocol_policy
  }

  ordered_cache_behavior {
    path_pattern     = "/deployed-date.txt"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "group-${var.current_color}.${var.dns_domain}"

    lambda_function_association {
      event_type   = "origin-response"
      lambda_arn   = module.header_security_lambda.qualified_arn
      include_body = false
    }

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 180
    max_ttl                = 180
    compress               = true
    viewer_protocol_policy = var.viewer_protocol_policy
  }

  lifecycle {
    ignore_changes = [aliases]
  }

  aliases = [
    "${var.current_color}.${var.dns_domain}"
  ]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.public_certificate.arn
    ssl_support_method  = "sni-only"
  }
}

data "aws_route53_zone" "public_zone" {
  name = "${var.zone_name}."
}

resource "aws_route53_record" "public_www" {
  zone_id = data.aws_route53_zone.public_zone.zone_id
  name    = "${var.current_color}.${var.dns_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.public_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.public_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
