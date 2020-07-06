resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "websocket_api_${var.environment}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$connect"
  authorization_type = "CUSTOM"
  authorizer_id = aws_apigatewayv2_authorizer.websocket_authorizer.id
  target    = "integrations/${aws_apigatewayv2_integration.websockets_connect_integration.id}"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.websockets_disconnect_integration.id}"
}

data "archive_file" "zip_websockets" {
  type        = "zip"
  output_path = "${path.module}/lambdas/websockets.js.zip"
  source_file = "${path.module}/lambdas/dist/websockets.js"
}

resource "aws_lambda_function" "websockets_connect_lambda" {
  filename      = data.archive_file.zip_websockets.output_path
  function_name = "websockets_connect_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "websockets.connectHandler"
  source_code_hash = data.archive_file.zip_websockets.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = data.null_data_source.locals.outputs
  }
}


resource "aws_lambda_function" "websockets_disconnect_lambda" {
  filename      = data.archive_file.zip_websockets.output_path
  function_name = "websockets_disconnect_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "websockets.disconnectHandler"
  source_code_hash = data.archive_file.zip_websockets.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_apigatewayv2_integration" "websockets_connect_integration" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_method = "POST"
  integration_uri = aws_lambda_function.websockets_connect_lambda.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
  content_handling_strategy = "CONVERT_TO_TEXT"
}


resource "aws_apigatewayv2_integration" "websockets_disconnect_integration" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_method = "POST"
  integration_uri = aws_lambda_function.websockets_disconnect_lambda.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
  content_handling_strategy = "CONVERT_TO_TEXT"
}

resource "aws_lambda_permission" "apigw_connect_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websockets_connect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}


resource "aws_lambda_permission" "apigw_disconnect_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websockets_disconnect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  name   = var.environment
}

resource "aws_apigatewayv2_deployment" "websocket_deploy" {
  api_id      = aws_apigatewayv2_api.websocket_api.id

  depends_on = [
    "aws_apigatewayv2_route.connect",
    "aws_apigatewayv2_route.disconnect",
  ]

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    deployed_at = "Deployed at ${timestamp()}"
  } 
}


resource "aws_acm_certificate" "websockets_east_cert" {
  domain_name       = "efcms-websockets-${var.environment}.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "efcms-websockets-${var.environment}.${var.dns_domain}"
    ProductDomain = "EFCMS websockets"
    Environment   = var.environment
    Description   = "Certificate for efcms-websockets-${var.environment}.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_websockets_east_cert" {
  certificate_arn         = aws_acm_certificate.websockets_east_cert.arn
  validation_record_fqdns = [aws_route53_record.websockets_route53_east_record.fqdn]
}

resource "aws_route53_record" "websockets_route53_east_record" {
  name    = aws_acm_certificate.websockets_east_cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.websockets_east_cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.id
  records = [
    aws_acm_certificate.websockets_east_cert.domain_validation_options.0.resource_record_value,
  ]
  ttl     = 60
}

resource "aws_apigatewayv2_domain_name" "websockets_domain" {
  domain_name = "efcms-websockets-${var.environment}.${var.dns_domain}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.websockets_east_cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "websocket_mapping" {
  api_id      = aws_apigatewayv2_api.websocket_api.id
  domain_name = aws_apigatewayv2_domain_name.websockets_domain.id
  stage       = aws_apigatewayv2_stage.stage.id
}

resource "aws_route53_record" "websocket_east_regional_record" {
  name    = aws_apigatewayv2_domain_name.websockets_domain.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.zone.id

  alias {
    evaluate_target_health = true
    name                   = aws_apigatewayv2_domain_name.websockets_domain.domain_name_configuration.0.target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.websockets_domain.domain_name_configuration.0.hosted_zone_id
  }
}

resource "aws_apigatewayv2_authorizer" "websocket_authorizer" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  authorizer_type  = "REQUEST"
  authorizer_uri   = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  identity_sources = ["route.request.querystring.token"]
  name             = "websocket_authorizer_${var.environment}"
}