resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "websocket_api_${var.environment}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_route" "connect" {
  api_id             = aws_apigatewayv2_api.websocket_api.id
  route_key          = "$connect"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.websocket_authorizer.id
  target             = "integrations/${aws_apigatewayv2_integration.websockets_connect_integration.id}"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.websockets_disconnect_integration.id}"
}

data "archive_file" "zip_websockets" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/websockets.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/websockets.js"
}

resource "aws_lambda_function" "websockets_connect_lambda" {
  filename         = data.archive_file.zip_websockets.output_path
  function_name    = "websockets_connect_${var.environment}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "websockets.connectHandler"
  source_code_hash = data.archive_file.zip_websockets.output_base64sha256
  timeout          = "29"
  memory_size      = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = var.lambda_environment
  }
}


resource "aws_lambda_function" "websockets_disconnect_lambda" {
  filename         = data.archive_file.zip_websockets.output_path
  function_name    = "websockets_disconnect_${var.environment}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "websockets.disconnectHandler"
  source_code_hash = data.archive_file.zip_websockets.output_base64sha256
  timeout          = "29"
  memory_size      = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_apigatewayv2_integration" "websockets_connect_integration" {
  api_id                    = aws_apigatewayv2_api.websocket_api.id
  integration_type          = "AWS_PROXY"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.websockets_connect_lambda.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
  credentials_arn           = "arn:aws:iam::${var.account_id}:role/api_gateway_invocation_role_${var.environment}"
  content_handling_strategy = "CONVERT_TO_TEXT"
}


resource "aws_apigatewayv2_integration" "websockets_disconnect_integration" {
  api_id                    = aws_apigatewayv2_api.websocket_api.id
  integration_type          = "AWS_PROXY"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.websockets_disconnect_lambda.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
  credentials_arn           = "arn:aws:iam::${var.account_id}:role/api_gateway_invocation_role_${var.environment}"
  content_handling_strategy = "CONVERT_TO_TEXT"
}

resource "aws_lambda_permission" "apigw_connect_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websockets_connect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}


resource "aws_lambda_permission" "apigw_disconnect_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websockets_disconnect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  name   = var.environment
}

resource "aws_apigatewayv2_deployment" "websocket_deploy" {
  api_id = aws_apigatewayv2_api.websocket_api.id

  depends_on = [
    aws_apigatewayv2_route.connect,
    aws_apigatewayv2_route.disconnect,
  ]

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    deployed_at = "Deployed at ${timestamp()}"
  }
}


resource "aws_acm_certificate" "websockets" {
  domain_name       = "ws.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "ws.${var.dns_domain}"
    ProductDomain = "EFCMS websockets"
    Environment   = var.environment
    Description   = "Certificate for ws.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_websockets" {
  certificate_arn         = aws_acm_certificate.websockets.arn
  validation_record_fqdns = [aws_route53_record.websockets_route53.0.fqdn]
  count                   = var.validate
}

resource "aws_route53_record" "websockets_route53" {
  name    = aws_acm_certificate.websockets.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.websockets.domain_validation_options.0.resource_record_type
  count   = var.validate
  zone_id = var.zone_id
  records = [
    aws_acm_certificate.websockets.domain_validation_options.0.resource_record_value,
  ]
  ttl = 60
}

resource "aws_apigatewayv2_domain_name" "websockets_domain" {
  domain_name = "ws.${var.dns_domain}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.websockets.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "websocket_mapping" {
  api_id      = aws_apigatewayv2_api.websocket_api.id
  domain_name = aws_apigatewayv2_domain_name.websockets_domain.id
  stage       = aws_apigatewayv2_stage.stage.id
}

resource "aws_route53_record" "websocket_regional_record" {
  name           = aws_apigatewayv2_domain_name.websockets_domain.domain_name
  type           = "A"
  zone_id        = var.zone_id
  set_identifier = "ws_${var.region}"

  alias {
    name                   = aws_apigatewayv2_domain_name.websockets_domain.domain_name_configuration.0.target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.websockets_domain.domain_name_configuration.0.hosted_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = var.region
  }
}

resource "aws_apigatewayv2_authorizer" "websocket_authorizer" {
  api_id                     = aws_apigatewayv2_api.websocket_api.id
  authorizer_type            = "REQUEST"
  authorizer_credentials_arn = "arn:aws:iam::${var.account_id}:role/api_gateway_invocation_role_${var.environment}"
  authorizer_uri             = var.authorizer_uri
  identity_sources           = ["route.request.querystring.token"]
  name                       = "websocket_authorizer_${var.environment}"
}
