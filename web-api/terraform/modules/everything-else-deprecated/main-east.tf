resource "aws_s3_bucket" "api_lambdas_bucket_east" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.lambdas"
  acl    = "private"

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

resource "aws_s3_bucket_object" "amended-petition-form-bucket-object-east" {
  bucket = aws_s3_bucket.documents_us_east_1.id
  key    = "amended-petition-form.pdf"
  source = "${path.module}/../../../../shared/static/pdfs/amended-petition-form.pdf"
}

resource "null_resource" "puppeteer_layer_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "aws_acm_certificate" "api_gateway_cert_east" {
  domain_name       = "*.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "wildcard.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for wildcard.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_route53_record" "route53_record_east" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert_east.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "wildcard_dns_validation_east" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_east.arn
  validation_record_fqdns = [for record in aws_route53_record.route53_record_east : record.fqdn]
  provider                = aws.us-east-1
}


data "aws_s3_bucket_object" "puppeteer_blue_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "blue_puppeteer_lambda_layer.zip"
}

data "aws_s3_bucket_object" "puppeteer_green_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "green_puppeteer_lambda_layer.zip"
}


data "aws_dynamodb_table" "green_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.green_table_name
}

data "aws_dynamodb_table" "blue_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.blue_table_name
}

resource "aws_api_gateway_domain_name" "public_api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "public-api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_domain_name" "api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom_main_east.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "public_api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.public_api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "public_api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.public_api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.public_api_custom_main_east.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

module "api-east-waf" {
  environment = var.environment
  providers = {
    aws = aws.us-east-1
  }
  source = "../waf/"
}

