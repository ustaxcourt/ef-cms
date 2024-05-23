data "aws_acm_certificate" "public_certificate" {
  domain = var.dns_domain
}

resource "aws_s3_bucket" "frontend_public" {
  bucket = "${var.current_color}.${var.dns_domain}"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_policy" "frontend_public_s3_policy" {
  bucket = aws_s3_bucket.frontend_public.id
  policy = data.aws_iam_policy_document.public_policy_bucket.json
}

resource "aws_s3_bucket_website_configuration" "frontend_public_s3_website" {
  bucket = aws_s3_bucket.frontend_public.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
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

resource "aws_s3_bucket" "failover_public" {
  bucket = "failover-${var.current_color}.${var.dns_domain}"

  tags = {
    environment = var.environment
  }

  provider = aws.us-west-1
}

resource "aws_s3_bucket_policy" "failover_public_s3_policy" {
  bucket   = aws_s3_bucket.failover_public.id
  policy   = data.aws_iam_policy_document.public_policy_bucket_failover.json
  provider = aws.us-west-1
}

resource "aws_s3_bucket_website_configuration" "failover_public_s3_website" {
  bucket   = aws_s3_bucket.failover_public.id
  provider = aws.us-west-1
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
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

data "aws_iam_policy_document" "public_policy_bucket" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::${var.current_color}.${var.dns_domain}/*"
    ]
  }
}

data "aws_iam_policy_document" "public_policy_bucket_failover" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::failover-${var.current_color}.${var.dns_domain}/*"
    ]
  }
}

resource "aws_cloudfront_distribution" "public_distribution" {
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
    domain_name = aws_s3_bucket_website_configuration.frontend_public_s3_website.website_endpoint
    origin_id   = "primary-${var.current_color}.${var.dns_domain}"

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
    domain_name = aws_s3_bucket_website_configuration.failover_public_s3_website.website_endpoint
    origin_id   = "failover-${var.current_color}.${var.dns_domain}"

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
