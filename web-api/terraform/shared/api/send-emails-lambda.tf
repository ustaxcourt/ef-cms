resource "aws_lambda_function" "send_emails_lambda" {
  depends_on       = [var.api_object]
  function_name    = "send_emails_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "send-emails.handler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "api_${var.current_color}.js.zip"
  source_code_hash = var.api_object_hash
  timeout          = "30"
  memory_size      = "3008"

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = "nodejs16.x"

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_lambda_event_source_mapping" "send_emails_mapping" {
  event_source_arn = aws_sqs_queue.send_emails_queue.arn
  function_name    = aws_lambda_function.send_emails_lambda.arn
  batch_size       = 1
}
