data "archive_file" "zip_authorizer" {
  type        = "zip"
  output_path = "${path.module}/lambdas/cognito-authorizer.js.zip"
  source_file = "${path.module}/lambdas/dist/cognito-authorizer.js"
}

resource "aws_lambda_function" "cognito_authorizer_lambda" {
  filename      = data.archive_file.zip_authorizer.output_path
  function_name = "cognito_authorizer_lambda_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_${var.environment}"
  handler       = "cognito-authorizer.handler"
  source_code_hash = data.archive_file.zip_authorizer.output_base64sha256
  
  runtime = "nodejs12.x"

  environment {
    variables = {
      USER_POOL_ID_MAIN = aws_cognito_user_pool.pool.id
      USER_POOL_ID_IRS = aws_cognito_user_pool.irs_pool.id
    }
  }
}

resource "aws_lambda_function" "cognito_authorizer_lambda_west" {
  filename      = data.archive_file.zip_authorizer.output_path
  function_name = "cognito_authorizer_lambda_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_${var.environment}"
  handler       = "cognito-authorizer.handler"
  source_code_hash = data.archive_file.zip_authorizer.output_base64sha256
  
  runtime = "nodejs12.x"

  environment {
    variables = {
      USER_POOL_ID_MAIN = aws_cognito_user_pool.pool.id
      USER_POOL_ID_IRS = aws_cognito_user_pool.irs_pool.id
    }
  }

  provider = aws.us-west-1
}