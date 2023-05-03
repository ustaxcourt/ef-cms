data "aws_caller_identity" "current" {}

data "archive_file" "zip_header_security_lambda" {
  type        = "zip"
  source_file = "${path.module}/cloudfront-edge/header-security-lambda.js"
  output_path = "${path.module}/cloudfront-edge/header-security-lambda.js.zip"
}

resource "aws_lambda_function" "header_security_lambda" {
  filename         = data.archive_file.zip_header_security_lambda.output_path
  function_name    = "header_security_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/header_security_lambda_role_${var.environment}"
  handler          = "header-security-lambda.handler"
  source_code_hash = data.archive_file.zip_header_security_lambda.output_base64sha256
  publish          = true
  runtime = "nodejs18.x"
}
