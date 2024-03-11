


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
  authorization = "NONE"
}

resource "aws_api_gateway_method" "api_auth_method_get" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_post
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "GET"
}

resource "aws_api_gateway_method" "api_auth_method_options" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_get
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "OPTIONS"
}

resource "aws_api_gateway_method" "api_auth_method_delete" {
  depends_on = [
    aws_api_gateway_method.api_auth_method_options
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "DELETE"
}

resource "aws_api_gateway_integration" "api_auth_integration_get" {
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_get.resource_id
  http_method = aws_api_gateway_method.api_auth_method_get.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_auth_integration_post" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_get
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_post.resource_id
  http_method = aws_api_gateway_method.api_auth_method_post.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_lambda.invoke_arn
}


resource "aws_api_gateway_integration" "api_auth_integration_delete" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_post
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_delete.resource_id
  http_method = aws_api_gateway_method.api_auth_method_delete.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "api_auth_integration_options" {

  depends_on = [
    aws_api_gateway_integration.api_auth_integration_delete
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_options.resource_id
  http_method = aws_api_gateway_method.api_auth_method_options.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_lambda.invoke_arn
}
