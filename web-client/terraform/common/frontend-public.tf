resource "aws_s3_bucket" "frontend_public" {
  bucket = "ui-public-${var.environment}.${var.dns_domain}"

  policy = data.aws_iam_policy_document.public_policy_bucket.json

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket" "failover_public" {
  bucket = "failover-ui-public-${var.environment}.${var.dns_domain}"

  policy = data.aws_iam_policy_document.public_policy_bucket_failover.json

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  region = "us-west-1"

  tags = {
    environment = var.environment
  }

  provider = aws.us-west-1
}

data "aws_iam_policy_document" "public_policy_bucket" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions   = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::ui-public-${var.environment}.${var.dns_domain}/*"
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

    actions   = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::failover-ui-public-${var.environment}.${var.dns_domain}/*"
    ]
  }
}


module "ui-public-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate?ref=v0.2.1"

  domain_name            = "ui-public-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  # is_hosted_zone_private = "false"
  # validation_method      = "DNS"
  certificate_name       = "ui-public-${var.environment}.${var.dns_domain}"
  environment            = var.environment
  description            = "Certificate for ui-public-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
}

resource "aws_cloudfront_distribution" "public_distribution" {
  origin_group {
    origin_id = "group-public-${var.environment}.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-public-${var.environment}.${var.dns_domain}"
    }

    member {
      origin_id = "failover-public-${var.environment}.${var.dns_domain}"
    }
  }

  origin {
    domain_name = aws_s3_bucket.frontend_public.website_endpoint
    origin_id   = "primary-public-${var.environment}.${var.dns_domain}"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name = "x-allowed-domain"
      value = var.dns_domain
    }
  }


  origin {
    domain_name = aws_s3_bucket.failover_public.website_endpoint
    origin_id   = "failover-public-${var.environment}.${var.dns_domain}"

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name = "x-allowed-domain"
      value = var.dns_domain
    }
  }

  custom_error_response = [
    {
      error_caching_min_ttl = 0
      error_code            = 404
      response_code         = 200
      response_page_path    = "/index.html"
    },
  ]

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-public-${var.environment}.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = var.cloudfront_default_ttl
    max_ttl                = var.cloudfront_max_ttl

    lambda_function_association {
      event_type   = "origin-response"
      lambda_arn   = aws_lambda_function.header_security_lambda.qualified_arn
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
    target_origin_id = "group-public-${var.environment}.${var.dns_domain}"

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
    viewer_protocol_policy = "redirect-to-https"
  }

  aliases = ["ui-public-${var.environment}.${var.dns_domain}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = module.ui-public-certificate.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }
}

data "aws_route53_zone" "public_zone" {
  name = "${var.dns_domain}."
}

resource "aws_route53_record" "public_www" {
  zone_id = data.aws_route53_zone.public_zone.zone_id
  name    = "ui-public-${var.environment}.${var.dns_domain}"
  type    = "A"

  alias = {
    name                   = aws_cloudfront_distribution.public_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.public_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
