data "aws_caller_identity" "current" {}

data "archive_file" "zip_cloudfront_edge" {
  type        = "zip"
  source_file = "${path.module}/cloudfront-edge/index.js"
  output_path = "${path.module}/cloudfront-edge/index.js.zip"
}

resource "aws_lambda_function" "header_security_lambda" {
  filename      = data.archive_file.zip_cloudfront_edge.output_path
  function_name = "header_security_lambda_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/header_security_lambda_role_${var.environment}"
  handler       = "index.handler"
  source_code_hash = data.archive_file.zip_cloudfront_edge.output_base64sha256
  publish = true
  
  runtime = "nodejs10.x"
}

