data "archive_file" "zip_authorizer" {
  type        = "zip"
  output_path = "${path.module}/cognito-authorizer/index.js.zip"
  source_file = "${path.module}/cognito-authorizer/dist/index.js"
}

resource "aws_lambda_function" "cognito_authorizer_lambda" {
  filename      = "${data.archive_file.zip_authorizer.output_path}"
  function_name = "cognito_authorizer_lambda_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_${var.environment}"
  handler       = "index.handler"
  source_code_hash = "${data.archive_file.zip_authorizer.output_base64sha256}"
  
  runtime = "nodejs12.x"

  environment {
    variables = {
      USER_POOL_ID_MAIN = "${aws_cognito_user_pool.pool.id}"
      USER_POOL_ID_IRS = "${aws_cognito_user_pool.irs_pool.id}"
    }
  }
}