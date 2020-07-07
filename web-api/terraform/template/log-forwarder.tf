data "archive_file" "zip_forwarder" {
  type        = "zip"
  output_path = "${path.module}/lambdas/log-forwarder.js.zip"
  source_file = "${path.module}/lambdas/dist/log-forwarder.js"
}

resource "aws_lambda_function" "log_forwarder" {
  filename      = data.archive_file.zip_forwarder.output_path
  function_name = "log_forwarder_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/log_forwarder_role_${var.environment}"
  handler       = "log-forwarder.handler"
  source_code_hash = data.archive_file.zip_forwarder.output_base64sha256
  
  runtime = "nodejs12.x"

  environment {
    variables = {
      CIRCLE_HONEYBADGER_API_KEY = var.honeybadger_key
      NODE_ENV = "production"
    }
  }
}


resource "aws_lambda_function" "log_forwarder_west" {
  filename      = data.archive_file.zip_forwarder.output_path
  function_name = "log_forwarder_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/log_forwarder_role_${var.environment}"
  handler       = "log-forwarder.handler"
  source_code_hash = data.archive_file.zip_forwarder.output_base64sha256
  
  runtime = "nodejs12.x"

  environment {
    variables = {
      CIRCLE_HONEYBADGER_API_KEY = var.honeybadger_key
      NODE_ENV = "production"
    }
  }

  provider = aws.us-west-1
}