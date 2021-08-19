resource "aws_lambda_function" "api_lambda" {
  depends_on       = [var.api_object]
  function_name    = "api_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "api.handler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "api_${var.current_color}.js.zip"
  source_code_hash = var.api_object_hash
  timeout          = "29"
  memory_size      = "3008"

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_api_gateway_rest_api" "gateway_for_api" {
  name = "gateway_api_${var.environment}_${var.current_color}"

  minimum_compression_size = "1"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_gateway_response" "large_payload" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  status_code   = "413"
  response_type = "REQUEST_TOO_LARGE"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
  }
}

resource "aws_api_gateway_gateway_response" "timeout" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  status_code   = "504"
  response_type = "INTEGRATION_TIMEOUT"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'"
  }
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id   = aws_api_gateway_rest_api.gateway_for_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_method_get" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_post" {
  depends_on = [
    aws_api_gateway_method.api_method_get
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_put" {
  depends_on = [
    aws_api_gateway_method.api_method_post
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_delete" {
  depends_on = [
    aws_api_gateway_method.api_method_put
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "DELETE"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_options" {
  depends_on = [
    aws_api_gateway_method.api_method_delete
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_authorizer" "custom_authorizer" {
  name                   = "custom_authorizer_${var.environment}_${var.current_color}"
  rest_api_id            = aws_api_gateway_rest_api.gateway_for_api.id
  authorizer_uri         = var.authorizer_uri
  authorizer_credentials = "arn:aws:iam::${var.account_id}:role/api_gateway_invocation_role_${var.environment}"
}

resource "aws_api_gateway_integration" "api_integration_get" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_get.resource_id
  http_method = aws_api_gateway_method.api_method_get.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_post" {
  depends_on = [
    aws_api_gateway_integration.api_integration_get
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_post.resource_id
  http_method = aws_api_gateway_method.api_method_post.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_put" {
  depends_on = [
    aws_api_gateway_integration.api_integration_post
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_put.resource_id
  http_method = aws_api_gateway_method.api_method_put.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_delete" {
  depends_on = [
    aws_api_gateway_integration.api_integration_put
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_delete.resource_id
  http_method = aws_api_gateway_method.api_method_delete.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_options" {
  depends_on = [
    aws_api_gateway_integration.api_integration_delete
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_options.resource_id
  http_method = aws_api_gateway_method.api_method_options.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.gateway_for_api.execution_arn}/*/*/*"
}


resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_method.api_method_get,
    aws_api_gateway_method.api_method_post,
    aws_api_gateway_method.api_method_put,
    aws_api_gateway_method.api_method_delete,
    aws_api_gateway_method.api_method_options,
    aws_api_gateway_integration.api_integration_get,
    aws_api_gateway_integration.api_integration_post,
    aws_api_gateway_integration.api_integration_put,
    aws_api_gateway_integration.api_integration_delete,
    aws_api_gateway_integration.api_integration_options,
    aws_api_gateway_authorizer.custom_authorizer
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.gateway_for_api,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  stage_name    = var.environment
  description   = "Deployed at ${timestamp()}"
  deployment_id = aws_api_gateway_deployment.api_deployment.id

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_stage_logs.arn

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

resource "aws_cloudwatch_log_group" "api_stage_logs" {
  name = "/aws/apigateway/${aws_api_gateway_rest_api.gateway_for_api.name}"
}

resource "aws_acm_certificate" "api_gateway_cert" {
  domain_name       = "api-${var.current_color}.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "api-${var.current_color}.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for api.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_api_gateway_cert" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.api_route53_record : record.fqdn]
  count                   = var.validate
}
resource "aws_route53_record" "api_route53_record" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert.domain_validation_options : dvo.domain_name => {
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

resource "aws_api_gateway_domain_name" "api_custom" {
  depends_on               = [aws_acm_certificate.api_gateway_cert]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert.arn
  domain_name              = "api-${var.current_color}.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_route53_record" "api_route53_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom.domain_name
  type           = "A"
  zone_id        = var.zone_id
  set_identifier = "api_${var.region}_${var.current_color}"

  alias {
    name                   = aws_api_gateway_domain_name.api_custom.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = var.region
  }
}

resource "aws_api_gateway_base_path_mapping" "api_mapping" {
  api_id      = aws_api_gateway_rest_api.gateway_for_api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  domain_name = aws_api_gateway_domain_name.api_custom.domain_name
}

resource "aws_api_gateway_method_settings" "api_default" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  method_path = "*/*"

  settings {
    throttling_burst_limit = 5000 // concurrent request limit
    throttling_rate_limit = 10000 // per second
  }
}

resource "aws_wafv2_web_acl_association" "association" {
  resource_arn = aws_api_gateway_stage.api_stage.arn
  web_acl_arn  = var.web_acl_arn
}
