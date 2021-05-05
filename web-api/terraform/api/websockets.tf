resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "websocket_api_${var.environment}_${var.current_color}"
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

resource "aws_lambda_function" "websockets_connect_lambda" {
  depends_on       = [var.websockets_object]
  function_name    = "websockets_connect_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "websockets.connectHandler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "websockets_${var.current_color}.js.zip"
  source_code_hash = var.websockets_object_hash
  timeout          = "29"
  memory_size      = "3008"

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}


resource "aws_lambda_function" "websockets_disconnect_lambda" {
  depends_on       = [var.websockets_object]
  function_name    = "websockets_disconnect_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "websockets.disconnectHandler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "websockets_${var.current_color}.js.zip"
  source_code_hash = var.websockets_object_hash
  timeout          = "29"
  memory_size      = "3008"

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
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
  api_id        = aws_apigatewayv2_api.websocket_api.id
  name          = var.environment
  deployment_id = aws_apigatewayv2_deployment.websocket_deploy.id
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
  domain_name       = "ws-${var.current_color}.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "ws-${var.current_color}.${var.dns_domain}"
    ProductDomain = "EFCMS websockets"
    Environment   = var.environment
    Description   = "Certificate for ws.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_websockets" {
  certificate_arn         = aws_acm_certificate.websockets.arn
  validation_record_fqdns = [for record in aws_route53_record.websockets_route53 : record.fqdn]
  count                   = var.validate
}

resource "aws_route53_record" "websockets_route53" {
  for_each = {
    for dvo in aws_acm_certificate.websockets.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = var.zone_id
  ttl             = 60
  allow_overwrite = true
}

resource "aws_apigatewayv2_domain_name" "websockets_domain" {
  domain_name = "ws-${var.current_color}.${var.dns_domain}"

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
  set_identifier = "ws_${var.region}_${var.current_color}"

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
  name                       = "websocket_authorizer_${var.environment}_${var.current_color}"
}
