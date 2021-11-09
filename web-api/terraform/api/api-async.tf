resource "aws_lambda_function" "api_async_lambda" {
  depends_on       = [var.api_object]
  function_name    = "api_async_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "api.handler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "api_${var.current_color}.js.zip"
  source_code_hash = var.api_object_hash
  timeout          = "900"
  memory_size      = "5000"

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_api_gateway_resource" "api_async_base_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id   = aws_api_gateway_rest_api.gateway_for_api.root_resource_id
  path_part   = "async"
}

resource "aws_api_gateway_resource" "api_async_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id   = aws_api_gateway_resource.api_async_base_resource.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_async_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_async_resource.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_async_method_put" {
  depends_on = [
    aws_api_gateway_method.api_async_method_post
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_async_resource.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_async_method_get" {
  depends_on = [
    aws_api_gateway_method.api_async_method_put
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_async_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_async_method_options" {
  depends_on = [
    aws_api_gateway_method.api_async_method_get
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_async_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_async_integration_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_async_method_post.resource_id
  http_method = aws_api_gateway_method.api_async_method_post.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_async_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
"body" : "$input.body",
"path" : "$context.path",
"httpMethod" : "$context.httpMethod",
"headers" : {
  "Authorization": "$input.params('Authorization')",
  "Content-Type": "$input.params('Content-Type')"
}
}
EOF
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_integration" "api_async_integration_put" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_post
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_async_method_put.resource_id
  http_method = aws_api_gateway_method.api_async_method_put.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_async_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
"body" : "$input.body",
"path" : "$context.path",
"httpMethod" : "$context.httpMethod",
"headers" : {
  "Authorization": "$input.params('Authorization')",
  "Content-Type": "$input.params('Content-Type')"
}
}
EOF
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_integration" "api_async_integration_get" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_put
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_async_method_get.resource_id
  http_method = aws_api_gateway_method.api_async_method_get.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_async_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
"body" : "$input.body",
"path" : "$context.path",
"httpMethod" : "$context.httpMethod",
"headers" : {
  "Authorization": "$input.params('Authorization')",
  "Content-Type": "$input.params('Content-Type')"
}
}
EOF
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_integration" "api_async_integration_options" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_get
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_async_method_options.resource_id
  http_method = aws_api_gateway_method.api_async_method_options.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "async_method_response_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_post.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "async_response_post" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_post,
    aws_api_gateway_method.api_async_method_post,
    aws_api_gateway_resource.api_async_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_post.http_method
  status_code = aws_api_gateway_method_response.async_method_response_post.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'POST'"
  }
}

resource "aws_api_gateway_method_response" "async_method_response_put" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_put.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "async_response_put" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_put,
    aws_api_gateway_method.api_async_method_put,
    aws_api_gateway_resource.api_async_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_put.http_method
  status_code = aws_api_gateway_method_response.async_method_response_put.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'PUT'"
  }
}

resource "aws_api_gateway_method_response" "async_method_response_get" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_get.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "async_response_get" {
  depends_on = [
    aws_api_gateway_integration.api_async_integration_get,
    aws_api_gateway_method.api_async_method_get,
    aws_api_gateway_resource.api_async_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_async_resource.id
  http_method = aws_api_gateway_method.api_async_method_get.http_method
  status_code = aws_api_gateway_method_response.async_method_response_get.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET'"
  }
}

resource "aws_lambda_permission" "apigw_async_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_async_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.gateway_for_api.execution_arn}/*/*/*"
}
