data "archive_file" "zip_public_authorizer" {
  type        = "zip"
  output_path = "${path.module}/lambdas/public-api-authorizer.js.zip"
  source_file = "${path.module}/lambdas/dist/public-api-authorizer/public-api-authorizer.js"
}

resource "aws_lambda_function" "public_api_authorizer_lambda" {
  filename         = data.archive_file.zip_public_authorizer.output_path
  function_name    = "public_api_authorizer_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/public_api_authorizer_role_${var.environment}"
  handler          = "public-api-authorizer.handler"
  source_code_hash = data.archive_file.zip_public_authorizer.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      NODE_ENV          = "production"
      LOG_LEVEL         = "info"
      STAGE             = var.environment
    }
  }
}

resource "aws_lambda_function" "public_api_authorizer_lambda_west" {
  filename         = data.archive_file.zip_public_authorizer.output_path
  function_name    = "public_api_authorizer_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/public_api_authorizer_role_${var.environment}"
  handler          = "public-api-authorizer.handler"
  source_code_hash = data.archive_file.zip_public_authorizer.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      NODE_ENV          = "production"
      LOG_LEVEL         = "info"
      STAGE             = var.environment
    }
  }

  provider = aws.us-west-1
}
