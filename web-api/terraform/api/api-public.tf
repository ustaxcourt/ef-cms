data "archive_file" "zip_api_public" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/api-public.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/api-public.js"
}

resource "aws_lambda_function" "api_public_lambda" {
  filename         = data.archive_file.zip_api_public.output_path
  function_name    = "api_public_${var.environment}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "api-public.handler"
  source_code_hash = data.archive_file.zip_api_public.output_base64sha256
  timeout          = "10"
  memory_size      = "3008"

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = "nodejs12.x"

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_api_gateway_rest_api" "gateway_for_api_public" {
  name = "gateway_api_public_${var.environment}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "api_public_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api_public.id
  parent_id   = aws_api_gateway_rest_api.gateway_for_api_public.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_public_method" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api_public.id
  resource_id   = aws_api_gateway_resource.api_public_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_public_integration" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api_public.id
  resource_id = aws_api_gateway_method.api_public_method.resource_id
  http_method = aws_api_gateway_method.api_public_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_public_lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_public_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_public_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.gateway_for_api_public.execution_arn}/*/*/*"
}

resource "aws_api_gateway_deployment" "api_public_deployment" {
  depends_on = [
    aws_api_gateway_method.api_public_method,
    aws_api_gateway_integration.api_public_integration
  ]
  rest_api_id       = aws_api_gateway_rest_api.gateway_for_api_public.id
  stage_name        = var.environment
  stage_description = "Deployed at ${timestamp()}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "api_gateway_cert_public" {
  domain_name       = "public-api.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "public-api.${var.dns_domain}"
    ProductDomain = "EFCMS Public API"
    Environment   = var.environment
    Description   = "Certificate for public-api.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_api_gateway_cert_public" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_public.arn
  validation_record_fqdns = [aws_route53_record.api_public_route53_record.0.fqdn]
  count                   = var.validate
}

resource "aws_route53_record" "api_public_route53_record" {
  name    = aws_acm_certificate.api_gateway_cert_public.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.api_gateway_cert_public.domain_validation_options.0.resource_record_type
  zone_id = var.zone_id
  count   = var.validate
  records = [
    aws_acm_certificate.api_gateway_cert_public.domain_validation_options.0.resource_record_value,
  ]
  ttl = 60
}

resource "aws_api_gateway_domain_name" "api_public_custom" {
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_public.arn
  domain_name              = "public-api.${var.dns_domain}"

  security_policy = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_route53_record" "api_public_route53_regional_record" {
  name           = aws_api_gateway_domain_name.api_public_custom.domain_name
  type           = "A"
  zone_id        = var.zone_id
  set_identifier = "api_public_${var.region}"

  alias {
    name                   = aws_api_gateway_domain_name.api_public_custom.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_public_custom.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = var.region
  }
}

resource "aws_api_gateway_base_path_mapping" "api_public_mapping" {
  api_id      = aws_api_gateway_rest_api.gateway_for_api_public.id
  stage_name  = aws_api_gateway_deployment.api_public_deployment.stage_name
  domain_name = aws_api_gateway_domain_name.api_public_custom.domain_name
}
