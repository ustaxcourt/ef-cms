data "aws_acm_certificate" "private_certificate" {
  domain = "*.${var.dns_domain}"
}

resource "aws_s3_bucket" "frontend" {
  bucket = "app-${var.current_color}.${var.dns_domain}"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_policy" "frontend_s3_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.allow_public.json
}

resource "aws_s3_bucket_website_configuration" "frontend_s3_website" {
  bucket = aws_s3_bucket.frontend.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend_sse" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket" "failover" {
  bucket = "app-failover-${var.current_color}.${var.dns_domain}"
  tags = {
    environment = var.environment
  }

  provider = aws.us-west-1
}

resource "aws_s3_bucket_policy" "failover_policy" {
  bucket   = aws_s3_bucket.failover.id
  policy   = data.aws_iam_policy_document.allow_public_failover.json
  provider = aws.us-west-1
}

resource "aws_s3_bucket_website_configuration" "failover_s3_website" {
  bucket   = aws_s3_bucket.failover.id
  provider = aws.us-west-1
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "failover_sse" {
  bucket   = aws_s3_bucket.failover.id
  provider = aws.us-west-1

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

data "aws_iam_policy_document" "allow_public" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::app-${var.current_color}.${var.dns_domain}/*"
    ]
  }
}

data "aws_iam_policy_document" "allow_public_failover" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::app-failover-${var.current_color}.${var.dns_domain}/*"
    ]
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "origin used for cloudfront group origins"
}

resource "aws_cloudfront_distribution" "distribution" {
  origin_group {
    origin_id = "group-app-${var.current_color}.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-app-${var.current_color}.${var.dns_domain}"
    }

    member {
      origin_id = "failover-app-${var.current_color}.${var.dns_domain}"
    }
  }

  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend_s3_website.website_endpoint
    origin_id   = "primary-app-${var.current_color}.${var.dns_domain}"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name  = "x-allowed-domain"
      value = var.zone_name
    }
  }


  origin {
    domain_name = aws_s3_bucket_website_configuration.failover_s3_website.website_endpoint
    origin_id   = "failover-app-${var.current_color}.${var.dns_domain}"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name  = "x-allowed-domain"
      value = var.zone_name
    }
  }

  origin_group {
    origin_id = "group-documents.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-documents.${var.dns_domain}"
    }

    member {
      origin_id = "failover-documents.${var.dns_domain}"
    }
  }

  origin_group {
    origin_id = "group-temp-documents.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-temp-documents.${var.dns_domain}"
    }

    member {
      origin_id = "failover-temp-documents.${var.dns_domain}"
    }
  }

  origin {
    domain_name = "${var.dns_domain}-documents-${var.environment}-us-east-1.s3.amazonaws.com"
    origin_id   = "primary-documents.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_documents_oac.id
  }

  origin {
    domain_name = "${var.dns_domain}-documents-${var.environment}-us-west-1.s3.amazonaws.com"
    origin_id   = "failover-documents.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_documents_oac.id
  }

  origin {
    domain_name = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1.s3.amazonaws.com"
    origin_id   = "primary-temp-documents.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_documents_oac.id
  }

  origin {
    domain_name = "${var.dns_domain}-temp-documents-${var.environment}-us-west-1.s3.amazonaws.com"
    origin_id   = "failover-temp-documents.${var.dns_domain}"
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_documents_oac.id
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
    target_origin_id       = "group-app-${var.current_color}.${var.dns_domain}"
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
    target_origin_id = "group-app-${var.current_color}.${var.dns_domain}"

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
    path_pattern           = "/documents/*"
    viewer_protocol_policy = var.viewer_protocol_policy
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-documents.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = module.strip_basepath_lambda.qualified_arn
      include_body = false
    }

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    trusted_key_groups = [aws_cloudfront_key_group.key_group.id]
  }

  ordered_cache_behavior {
    path_pattern           = "/temp-documents/*"
    viewer_protocol_policy = var.viewer_protocol_policy
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-temp-documents.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = module.strip_basepath_lambda.qualified_arn
      include_body = false
    }

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    trusted_key_groups = [aws_cloudfront_key_group.key_group.id]
  }

  lifecycle {
    ignore_changes = [aliases]
  }

  aliases = ["app-${var.current_color}.${var.dns_domain}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.private_certificate.arn
    ssl_support_method  = "sni-only"
  }

}

resource "aws_cloudfront_origin_access_control" "cloudfront_documents_oac" {
  name                              = "cloudfront_documents_oac_${var.environment}_${var.current_color}"
  description                       = "Origin access control used for fetching private documents from documents bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_kms_key" "origin_access_control_signing_key" {
  description              = "RSA-2048 asymmetric KMS key Key pair used to sign document urls"
  customer_master_key_spec = "RSA_2048"
  key_usage                = "SIGN_VERIFY"
  enable_key_rotation      = false
}

data "aws_kms_public_key" "origin_access_control_public_signing_key" {
  key_id = aws_kms_key.origin_access_control_signing_key.id
}

resource "aws_cloudfront_public_key" "public_key_for_documents" {
  encoded_key = data.aws_kms_public_key.origin_access_control_public_signing_key.public_key_pem
  name        = "public_key_for_documents"
}

resource "aws_cloudfront_key_group" "key_group" {
  comment = "oac_key_group_${var.environment}_${var.current_color}"
  items   = [aws_cloudfront_public_key.public_key_for_documents.id]
  name    = "oac_key_group_${var.environment}_${var.current_color}"
}

data "aws_route53_zone" "zone" {
  name = "${var.zone_name}."
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "app-${var.current_color}.${var.dns_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
