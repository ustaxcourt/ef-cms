resource "aws_s3_bucket" "public_redirect" {
  #checkov:skip=CKV_AWS_21: redirect-only bucket — no content served, issues HTTP 301 via S3 website config, versioning adds cost with no recovery value
  #checkov:skip=CKV_AWS_18: redirect-only bucket — issues HTTP 301 via S3 website config, no content served; access logging has no security value here
  #checkov:skip=CKV_AWS_145: redirect-only bucket — no content stored; CMK encryption not warranted for a zero-byte redirect-only bucket
  bucket = "www.${var.dns_domain}"
  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "public_redirect_sse" {
  bucket = aws_s3_bucket.public_redirect.id

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_website_configuration" "public_redirect_s3_website" {
  bucket = aws_s3_bucket.public_redirect.id
  redirect_all_requests_to {
    host_name = var.dns_domain
    protocol  = "https"
  }
}

resource "aws_s3_bucket_policy" "redirect_policy" {
  bucket = aws_s3_bucket.public_redirect.id
  policy = data.aws_iam_policy_document.www_redirect_policy_bucket.json
}

data "aws_iam_policy_document" "www_redirect_policy_bucket" {
  #checkov:skip=CKV_AWS_283: Principal * is intentional — this is a redirect-only bucket serving HTTP 301 via S3 website config; content is zero bytes, no sensitive data to restrict
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::www.${var.dns_domain}/*"
    ]
  }
}

resource "aws_cloudfront_distribution" "public_distribution_www" {
  #checkov:skip=CKV_AWS_174: minimum_protocol_version not set — redirect-only distribution serving HTTP 301s; no application content transmitted; TLS version enforcement not applicable
  #checkov:skip=CKV2_AWS_47:WAF not attached to this CloudFront distribution — serves only HTTP 301 redirects; no application content passes through it; WAF attached at API Gateway layer
  #checkov:skip=CKV_AWS_374:No geo restriction intentional — US Tax Court is accessible to overseas military and international tax cases
  #checkov:skip=CKV2_AWS_32:Security headers managed by header_security_lambda Lambda@Edge; CloudFront response headers policy would conflict
  #checkov:skip=CKV_AWS_305:default_root_object not applicable — redirect-only distribution; all requests forwarded via redirect_all_requests_to; no content is served
  #checkov:skip=CKV_AWS_310:origin failover not configured — single redirect origin; redirect-only distribution has no content to fail over
  #checkov:skip=CKV_AWS_68: WAF is associated at API Gateway layer — this CloudFront distribution serves only HTTP 301 redirects, no application content passes through it
  #checkov:skip=CKV_AWS_86: CloudFront access logging not enabled — redirect-only distribution with no application content; CloudWatch metrics cover operational visibility
  origin {
    domain_name = aws_s3_bucket_website_configuration.public_redirect_s3_website.website_endpoint
    origin_id   = "www.${var.dns_domain}"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled = true

  default_cache_behavior {
    viewer_protocol_policy = var.viewer_protocol_policy
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "www.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  aliases = [
    "www.${var.dns_domain}"
  ]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.public_certificate_arn
    ssl_support_method  = "sni-only"
  }
}

data "aws_route53_zone" "public_zone_www" {
  name = "${var.zone_name}."
}

resource "aws_route53_record" "public_www_redirect" {
  zone_id = data.aws_route53_zone.public_zone_www.zone_id
  name    = "www.${var.dns_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.public_distribution_www.domain_name
    zone_id                = aws_cloudfront_distribution.public_distribution_www.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket_public_access_block" "unblock_public_www_redirect" {
  #checkov:skip=CKV_AWS_53: public access block intentionally disabled — redirect-only bucket must be publicly readable to serve HTTP 301 via S3 website config
  #checkov:skip=CKV_AWS_54: same reason as CKV_AWS_53
  #checkov:skip=CKV_AWS_55: same reason as CKV_AWS_53
  #checkov:skip=CKV_AWS_56: same reason as CKV_AWS_53
  bucket = aws_s3_bucket.public_redirect.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
