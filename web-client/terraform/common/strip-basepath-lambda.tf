data "archive_file" "zip_strip_basepath_lambda" {
  type        = "zip"
  source_file = "${path.module}/cloudfront-edge/strip-basepath-lambda.js"
  output_path = "${path.module}/cloudfront-edge/strip-basepath-lambda.js.zip"
}

resource "aws_lambda_function" "strip_basepath_lambda" {
  filename         = data.archive_file.zip_strip_basepath_lambda.output_path
  function_name    = "strip_basepath_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/strip_basepath_lambda_role_${var.environment}"
  handler          = "strip-basepath-lambda.handler"
  source_code_hash = data.archive_file.zip_strip_basepath_lambda.output_base64sha256
  publish          = true

  runtime = "nodejs18.x"
}
