data "archive_file" "zip_api" {
  type        = "zip"
  output_path = "${path.module}/api/index.js.zip"
  source_file = "${path.module}/api/dist/index.js"
}

# resource "aws_cloudwatch_log_group" "api_lambda_log_group" {
#   name              = "/aws/lambda/api_${var.environment}"
#   retention_in_days = 14
# }

resource "aws_lambda_function" "api_lambda" {
  filename      = "${data.archive_file.zip_api.output_path}"
  function_name = "api_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "index.handler"
  source_code_hash = "${data.archive_file.zip_api.output_base64sha256}"
  
  runtime = "nodejs12.x"

  # depends_on = ["aws_cloudwatch_log_group.api_lambda_log_group"]

  environment {
    variables = {
      S3_ENDPOINT = "s3.us-east-1.amazonaws.com"
      DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      TEMP_DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
      MASTER_DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
      # ELASTICSEARCH_ENDPOINT = ${ELASTICSEARCH_ENDPOINT}
      MASTER_REGION = "us-east-1"
      STAGE = "${var.environment}"
      # USER_POOL_ID = "${USER_POOL_ID}"
      NODE_ENV = "production"
      EMAIL_SOURCE = "noreply@mail.efcms-${var.environment}.${var.dns_domain}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE = "petition_served_${var.environment}"
      EFCMS_DOMAIN = "${var.dns_domain}"
      CLAMAV_DEF_DIR = "/opt/var/lib/clamav"
      # CIRCLE_HONEYBADGER_API_KEY = ${CIRCLE_HONEYBADGER_API_KEY}
      # IRS_SUPERUSER_EMAIL = ${IRS_SUPERUSER_EMAIL}
    }
  }
}

resource "aws_api_gateway_rest_api" "gateway_for_api" {
  name = "gateway_api_${var.environment}"
}

resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.gateway_for_api.id}"
  parent_id = "${aws_api_gateway_rest_api.gateway_for_api.root_resource_id}"
  path_part = "{proxy+}"
}

resource "aws_api_gateway_method" "api_method" {
  rest_api_id = "${aws_api_gateway_rest_api.gateway_for_api.id}"
  resource_id = "${aws_api_gateway_resource.api_resource.id}"
  http_method = "ANY"
  authorization = "NONE"
}

# resource "aws_api_gateway_method" "proxy_root" {
#   rest_api_id   = "${aws_api_gateway_rest_api.gateway_for_api.id}"
#   resource_id   = "${aws_api_gateway_rest_api.gateway_for_api.root_resource_id}"
#   http_method   = "ANY"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "lambda_root" {
#   rest_api_id = "${aws_api_gateway_rest_api.gateway_for_api.id}"
#   resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
#   http_method = "${aws_api_gateway_method.proxy_root.http_method}"

#   integration_http_method = "POST"
#   type                    = "AWS_PROXY"
#   uri                     = "${aws_lambda_function.api_lambda.invoke_arn}"
# }

resource "aws_api_gateway_integration" "api_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.gateway_for_api.id}"
  resource_id = "${aws_api_gateway_method.api_method.resource_id}"
  http_method = "${aws_api_gateway_method.api_method.http_method}"

  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "${aws_lambda_function.api_lambda.invoke_arn}"
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.api_lambda.function_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gateway_for_api.execution_arn}/*/*/*"
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    "aws_api_gateway_method.api_method"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.gateway_for_api.id}"
  stage_name = "${var.environment}"
  description = "Deployed at ${timestamp()}"
}