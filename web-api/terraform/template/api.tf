data "archive_file" "zip_api" {
  type        = "zip"
  output_path = "${path.module}/lambdas/api.js.zip"
  source_file = "${path.module}/lambdas/dist/api.js"
}

resource "aws_lambda_function" "api_lambda" {
  filename      = data.archive_file.zip_api.output_path
  function_name = "api_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "api.handler"
  source_code_hash = data.archive_file.zip_api.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = "nodejs12.x"

  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_lambda_function" "api_clamav_lambda" {
  filename      = data.archive_file.zip_api.output_path
  function_name = "api_clamav_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "api.handler"
  source_code_hash = data.archive_file.zip_api.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  layers = [
    aws_lambda_layer_version.clamav_layer.arn
  ]

  runtime = "nodejs12.x"


  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_api_gateway_rest_api" "gateway_for_api" {
  name = "gateway_api_${var.environment}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "api_clamav_base_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id = aws_api_gateway_rest_api.gateway_for_api.root_resource_id
  path_part = "clamav"
}

resource "aws_api_gateway_resource" "api_clamav_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id = aws_api_gateway_resource.api_clamav_base_resource.id
  path_part = "{proxy+}"
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id = aws_api_gateway_rest_api.gateway_for_api.root_resource_id
  path_part = "{proxy+}"
}

resource "aws_api_gateway_method" "api_clamav_method_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_clamav_resource.id
  http_method = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_clamav_method_options" {
  depends_on = [
    "aws_api_gateway_method.api_clamav_method_post"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_clamav_resource.id
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "api_method_get" {
  depends_on = [
    "aws_api_gateway_method.api_clamav_method_options"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_post" {
  depends_on = [
    "aws_api_gateway_method.api_method_get"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_put" {
  depends_on = [
    "aws_api_gateway_method.api_method_post"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_delete" {
  depends_on = [
    "aws_api_gateway_method.api_method_put"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = "DELETE"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_method_options" {
  depends_on = [
    "aws_api_gateway_method.api_method_delete"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_authorizer" "custom_authorizer" {
  name                   = "custom_authorizer_${var.environment}"
  rest_api_id            = aws_api_gateway_rest_api.gateway_for_api.id
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  authorizer_credentials = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/api_gateway_invocation_role_${var.environment}"
}

resource "aws_api_gateway_integration" "api_clamav_integration_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_clamav_method_post.resource_id
  http_method = aws_api_gateway_method.api_clamav_method_post.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type = "AWS"
  uri = aws_lambda_function.api_clamav_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "clamav_method_response_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_clamav_resource.id
  http_method = aws_api_gateway_method.api_clamav_method_post.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true 
    "method.response.header.Access-Control-Allow-Headers" = true 
    "method.response.header.Access-Control-Allow-Methods" = true 
  }
}

resource "aws_api_gateway_integration_response" "clamav_response_post" {
  depends_on = [
    "aws_api_gateway_integration.api_clamav_integration_post"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_clamav_resource.id
  http_method = aws_api_gateway_method.api_clamav_method_post.http_method
  status_code = aws_api_gateway_method_response.clamav_method_response_post.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'POST'"
  }
}

resource "aws_api_gateway_integration" "api_clamav_integration_options" {
  depends_on = [
    "aws_api_gateway_integration.api_clamav_integration_post"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_clamav_method_options.resource_id
  http_method = aws_api_gateway_method.api_clamav_method_options.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}


resource "aws_api_gateway_integration" "api_integration_get" {
  depends_on = [
    "aws_api_gateway_integration.api_clamav_integration_options"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_get.resource_id
  http_method = aws_api_gateway_method.api_method_get.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_post" {
  depends_on = [
    "aws_api_gateway_integration.api_integration_get"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_post.resource_id
  http_method = aws_api_gateway_method.api_method_post.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_put" {
  depends_on = [
    "aws_api_gateway_integration.api_integration_post"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_put.resource_id
  http_method = aws_api_gateway_method.api_method_put.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_delete" {
  depends_on = [
    "aws_api_gateway_integration.api_integration_put"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_delete.resource_id
  http_method = aws_api_gateway_method.api_method_delete.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_integration_options" {
  depends_on = [
    "aws_api_gateway_integration.api_integration_delete"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_method_options.resource_id
  http_method = aws_api_gateway_method.api_method_options.http_method

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gateway_for_api.execution_arn}/*/*/*"
}


resource "aws_lambda_permission" "apigw_clamav_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_clamav_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gateway_for_api.execution_arn}/*/*/*"
}


resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    "aws_api_gateway_method.api_clamav_method_post",
    "aws_api_gateway_method.api_clamav_method_options",
    "aws_api_gateway_method.api_method_get",
    "aws_api_gateway_method.api_method_post",
    "aws_api_gateway_method.api_method_put",
    "aws_api_gateway_method.api_method_delete",
    "aws_api_gateway_method.api_method_options",
    "aws_api_gateway_integration.api_clamav_integration_post",
    "aws_api_gateway_integration.api_clamav_integration_options",
    "aws_api_gateway_integration.api_integration_get",
    "aws_api_gateway_integration.api_integration_post",
    "aws_api_gateway_integration.api_integration_put",
    "aws_api_gateway_integration.api_integration_delete",
    "aws_api_gateway_integration.api_integration_options",
    "aws_api_gateway_authorizer.custom_authorizer"
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  stage_name = var.environment
  stage_description = "Deployed at ${timestamp()}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "api_gateway_east_cert" {
  domain_name       = "efcms-api-${var.environment}.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "efcms-api-${var.environment}.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for efcms-api-${var.environment}.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_api_gateway_east_cert" {
  certificate_arn         = aws_acm_certificate.api_gateway_east_cert.arn
  validation_record_fqdns = [aws_route53_record.api_route53_east_record.fqdn]
}

resource "aws_route53_record" "api_route53_east_record" {
  name    = aws_acm_certificate.api_gateway_east_cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.api_gateway_east_cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.id
  records = [
    aws_acm_certificate.api_gateway_east_cert.domain_validation_options.0.resource_record_value,
  ]
  ttl     = 60
}

resource "aws_api_gateway_domain_name" "api_custom" {
  regional_certificate_arn = aws_acm_certificate_validation.validate_api_gateway_east_cert.certificate_arn
  domain_name     = "efcms-api-${var.environment}.${var.dns_domain}"
  security_policy = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_route53_record" "api_route53_east_regional_record" {
  name    = aws_api_gateway_domain_name.api_custom.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.zone.id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.api_custom.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom.regional_zone_id
  }
}

resource "aws_api_gateway_base_path_mapping" "api_mapping" {
  api_id      = aws_api_gateway_rest_api.gateway_for_api.id
  stage_name  = aws_api_gateway_deployment.api_deployment.stage_name
  domain_name = aws_api_gateway_domain_name.api_custom.domain_name
}