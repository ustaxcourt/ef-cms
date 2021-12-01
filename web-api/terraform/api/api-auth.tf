resource "aws_api_gateway_resource" "api_auth_base_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id   = aws_api_gateway_rest_api.gateway_for_api.root_resource_id
  path_part   = "auth"
}

resource "aws_api_gateway_resource" "api_auth_resource" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  parent_id   = aws_api_gateway_resource.api_auth_base_resource.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "api_auth_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_auth_method_put" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_post
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_auth_method_get" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_put
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.custom_authorizer.id
}

resource "aws_api_gateway_method" "api_auth_method_options" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_get
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_auth_integration_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_post.resource_id
  http_method = aws_api_gateway_method.api_auth_method_post.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
"body" : $input.json('$'),
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

resource "aws_api_gateway_integration" "api_auth_integration_put" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_post
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_put.resource_id
  http_method = aws_api_gateway_method.api_auth_method_put.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
"body" : $input.json('$'),
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

resource "aws_api_gateway_integration" "api_auth_integration_get" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_put
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_get.resource_id
  http_method = aws_api_gateway_method.api_auth_method_get.http_method

  request_parameters = {
    "integration.request.header.X-Amz-Invocation-Type" = "'Event'"
  }

  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = aws_lambda_function.api_lambda.invoke_arn

  request_templates = {
    "application/json" = <<EOF
{
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

resource "aws_api_gateway_integration" "api_auth_integration_options" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_get
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_options.resource_id
  http_method = aws_api_gateway_method.api_auth_method_options.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "auth_method_response_post" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_post.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "auth_response_post" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_post,
    aws_api_gateway_method.api_auth_method_post,
    aws_api_gateway_resource.api_auth_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_post.http_method
  status_code = aws_api_gateway_method_response.auth_method_response_post.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'POST'"
  }
}

resource "aws_api_gateway_method_response" "auth_method_response_put" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_put.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "auth_response_put" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_put,
    aws_api_gateway_method.api_auth_method_put,
    aws_api_gateway_resource.api_auth_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_put.http_method
  status_code = aws_api_gateway_method_response.auth_method_response_put.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'PUT'"
  }
}

resource "aws_api_gateway_method_response" "auth_method_response_get" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_get.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "auth_response_get" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_get,
    aws_api_gateway_method.api_auth_method_get,
    aws_api_gateway_resource.api_auth_resource
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_resource.api_auth_resource.id
  http_method = aws_api_gateway_method.api_auth_method_get.http_method
  status_code = aws_api_gateway_method_response.auth_method_response_get.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET'"
  }
}
