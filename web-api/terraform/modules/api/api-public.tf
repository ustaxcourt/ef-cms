module "api_public_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/api-public/api-public.ts"
  handler_method = "handler"
  lambda_name    = "api_public_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}

module "public_api_authorizer_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/publicApiAuthorizer/public-api-authorizer.ts"
  handler_method = "handler"
  lambda_name    = "public_api_authorizer_lambda_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/public_api_authorizer_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}


resource "aws_api_gateway_authorizer" "public_authorizer" {
  name                             = "public_authorizer_${var.environment}_${var.current_color}"
  rest_api_id                      = aws_api_gateway_rest_api.gateway_for_api_public.id
  authorizer_uri                   = module.public_api_authorizer_lambda.invoke_arn
  type                             = "REQUEST"
  identity_source                  = "context.identity.sourceIp"
  authorizer_result_ttl_in_seconds = 300
  authorizer_credentials           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/api_gateway_invocation_role_${var.environment}"
}

resource "aws_api_gateway_rest_api" "gateway_for_api_public" {
  name = "gateway_api_public_${var.environment}_${var.current_color}"

  minimum_compression_size = "1"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_gateway_response" "large_payload_public" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api_public.id
  status_code   = "413"
  response_type = "REQUEST_TOO_LARGE"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
  }
  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }
}

resource "aws_api_gateway_gateway_response" "timeout_public" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api_public.id
  status_code   = "504"
  response_type = "INTEGRATION_TIMEOUT"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
  }
  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
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
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.public_authorizer.id
}

resource "aws_api_gateway_integration" "api_public_integration" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api_public.id
  resource_id = aws_api_gateway_method.api_public_method.resource_id
  http_method = aws_api_gateway_method.api_public_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_public_lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_public_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.api_public_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.gateway_for_api_public.execution_arn}/*/*/*"
  lifecycle {
    replace_triggered_by = [
      module.api_public_lambda.last_modified
    ]
  }
}

resource "aws_api_gateway_deployment" "api_public_deployment" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api_public.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_method.api_public_method,
      aws_api_gateway_integration.api_public_integration,
      aws_api_gateway_authorizer.public_authorizer
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_public_stage" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api_public.id
  stage_name    = var.environment
  description   = "Deployed at ${timestamp()}"
  deployment_id = aws_api_gateway_deployment.api_public_deployment.id

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_public_stage_logs.arn

    format = jsonencode({
      level   = "info"
      message = "API Gateway Access Log"

      environment = {
        stage = var.environment
        color = var.current_color
      }

      requestId = {
        apiGateway = "$context.requestId"
        lambda     = "$context.integration.requestId"
        authorizer = "$context.authorizer.requestId"
      }

      request = {
        headers = {
          x-forwarded-for = "$context.identity.sourceIp"
          user-agent      = "$context.identity.userAgent"
        }
        method = "$context.httpMethod"
        url    = "$context.path"
      }

      authorizer = {
        error          = "$context.authorizer.error"
        responseTimeMs = "$context.authorizer.integrationLatency"
        statusCode     = "$context.authorizer.status"
      }

      response = {
        responseTimeMs = "$context.responseLatency"
        responseLength = "$context.responseLength"
        statusCode     = "$context.status"
      }

      metadata = {
        apiId        = "$context.apiId"
        resourcePath = "$context.resourcePath"
        resourceId   = "$context.resourceId"
      }
    })
  }
}

resource "aws_cloudwatch_log_group" "api_public_stage_logs" {
  name = "/aws/apigateway/${aws_api_gateway_rest_api.gateway_for_api_public.name}"
}

resource "aws_acm_certificate" "api_gateway_cert_public" {
  domain_name       = "public-api-${var.current_color}.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "public-api-${var.current_color}.${var.dns_domain}"
    ProductDomain = "EFCMS Public API"
    Environment   = var.environment
    Description   = "Certificate for public-api.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_api_gateway_cert_public" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_public.arn
  validation_record_fqdns = [for record in aws_route53_record.api_public_route53_record : record.fqdn]
}

resource "aws_route53_record" "api_public_route53_record" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert_public.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = var.zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_api_gateway_domain_name" "api_public_custom" {
  regional_certificate_arn = aws_acm_certificate_validation.validate_api_gateway_cert_public.certificate_arn
  domain_name              = "public-api-${var.current_color}.${var.dns_domain}"

  security_policy = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "api_public_mapping" {
  api_id      = aws_api_gateway_rest_api.gateway_for_api_public.id
  stage_name  = aws_api_gateway_stage.api_public_stage.stage_name
  domain_name = aws_api_gateway_domain_name.api_public_custom.domain_name
}

resource "aws_api_gateway_method_settings" "api_public_default" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api_public.id
  stage_name  = aws_api_gateway_stage.api_public_stage.stage_name
  method_path = "*/*"

  settings {
    throttling_burst_limit = 5000  // concurrent request limit
    throttling_rate_limit  = 10000 // per second
  }
}

resource "aws_route53_record" "api_public_route53_regional_record" {
  name            = aws_api_gateway_domain_name.api_public_custom.domain_name
  type            = "A"
  zone_id         = var.zone_id
  set_identifier  = "api_public_${var.region}_${var.current_color}"
  health_check_id = var.health_check_id

  alias {
    name                   = aws_api_gateway_domain_name.api_public_custom.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_public_custom.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = var.region
  }
}

resource "aws_wafv2_web_acl_association" "api_public_association" {
  resource_arn = aws_api_gateway_stage.api_public_stage.arn
  web_acl_arn  = var.web_acl_arn
}
