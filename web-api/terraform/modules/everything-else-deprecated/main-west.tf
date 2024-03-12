resource "aws_s3_bucket" "api_lambdas_bucket_west" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.lambdas"
  acl    = "private"

  provider = aws.us-west-1
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


resource "null_resource" "puppeteer_layer_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "aws_acm_certificate" "api_gateway_cert_west" {
  domain_name       = "*.${var.dns_domain}"
  validation_method = "DNS"
  provider          = aws.us-west-1

  tags = {
    Name          = "wildcard.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for wildcard.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_route53_record" "route53_record_west" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert_west.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name            = each.value.name
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "wildcard_dns_validation_west" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_west.arn
  validation_record_fqdns = [for record in aws_route53_record.route53_record_west : record.fqdn]
  provider                = aws.us-west-1
}



data "aws_s3_bucket_object" "puppeteer_blue_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "blue_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "puppeteer_green_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "green_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}

resource "aws_api_gateway_domain_name" "public_api_custom_main_west" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_west]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_west.arn
  domain_name              = "public-api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  provider                 = aws.us-west-1
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_domain_name" "api_custom_main_west" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_west]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_west.arn
  domain_name              = "api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  provider                 = aws.us-west-1
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_route53_record" "api_route53_main_west_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom_main_west.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "api_main_us_west_1"

  alias {
    name                   = aws_api_gateway_domain_name.api_custom_main_west.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom_main_west.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-west-1"
  }
}


resource "aws_route53_record" "public_api_route53_main_west_regional_record" {
  name           = aws_api_gateway_domain_name.public_api_custom_main_west.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "public_api_main_us_west_1"

  alias {
    name                   = aws_api_gateway_domain_name.public_api_custom_main_west.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.public_api_custom_main_west.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-west-1"
  }
}

module "api-west-waf" {
  environment = var.environment
  providers = {
    aws = aws.us-west-1
  }
  source = "../waf/"
}
