


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
  #checkov:skip=CKV2_AWS_53:API uses {proxy+} catch-all routing
  #checkov:skip=CKV_AWS_59:Auth endpoints intentionally unauthenticated — these are the login/token endpoints themselves; authorization is enforced at the application layer
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "api_auth_method_get" {
  #checkov:skip=CKV2_AWS_53:API uses {proxy+} catch-all routing
  #checkov:skip=CKV_AWS_59:Auth endpoints intentionally unauthenticated — these are the login/token endpoints themselves; authorization is enforced at the application layer
  depends_on = [
    aws_api_gateway_method.api_auth_method_post
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "GET"
}

resource "aws_api_gateway_method" "api_auth_method_options" {
  #checkov:skip=CKV2_AWS_53:API uses {proxy+} catch-all routing — API GW request validation requires per-route JSON Schema models which are meaningless on a proxy resource. Input validation is handled by ~120 Joi entity schemas in shared/src/business/entities/, called inside every interactor before persistence.
  depends_on = [
    aws_api_gateway_method.api_auth_method_get
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "OPTIONS"
}

resource "aws_api_gateway_method" "api_auth_method_delete" {
  #checkov:skip=CKV2_AWS_53:API uses {proxy+} catch-all routing
  #checkov:skip=CKV_AWS_59:Auth endpoints intentionally unauthenticated — these are the login/token endpoints themselves; authorization is enforced at the application layer
  depends_on = [
    aws_api_gateway_method.api_auth_method_options
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "DELETE"
}

resource "aws_api_gateway_method" "api_auth_method_put" {
  #checkov:skip=CKV2_AWS_53:API uses {proxy+} catch-all routing
  #checkov:skip=CKV_AWS_59:Auth endpoints intentionally unauthenticated — these are the login/token endpoints themselves; authorization is enforced at the application layer
  depends_on = [
    aws_api_gateway_method.api_auth_method_delete
  ]
  rest_api_id   = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id   = aws_api_gateway_resource.api_auth_resource.id
  authorization = "NONE"
  http_method   = "PUT"
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

resource "aws_api_gateway_integration" "api_auth_integration_put" {
  depends_on = [
    aws_api_gateway_integration.api_auth_integration_options
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_for_api.id
  resource_id = aws_api_gateway_method.api_auth_method_put.resource_id
  http_method = aws_api_gateway_method.api_auth_method_put.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.api_lambda.invoke_arn
}
