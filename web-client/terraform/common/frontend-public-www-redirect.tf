resource "aws_s3_bucket" "public_redirect" {
  bucket = "www.${var.dns_domain}"

  policy = data.aws_iam_policy_document.www_redirect_policy_bucket.json

  website {
    redirect_all_requests_to = "https://${var.dns_domain}"
  }

  tags = {
    environment = var.environment
  }
    server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
          sse_algorithm = "AES256"
      }
    }
  }
  
}

data "aws_iam_policy_document" "www_redirect_policy_bucket" {
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
  origin {
    domain_name = aws_s3_bucket.public_redirect.website_endpoint
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
    default_ttl            = var.cloudfront_default_ttl
    max_ttl                = var.cloudfront_max_ttl

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


  depends_on = [
    module.ui-public-certificate
  ]

  viewer_certificate {
    acm_certificate_arn = module.ui-public-certificate.acm_certificate_arn
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
