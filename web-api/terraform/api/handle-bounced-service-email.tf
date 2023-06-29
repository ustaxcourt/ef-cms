resource "aws_lambda_function" "zip_handle_bounce" {
  count            = var.create_bounce_handler
  depends_on       = [var.bounce_handler_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "bounce_handler_${var.current_color}.js.zip"
  source_code_hash = var.bounce_handler_object_hash
  function_name    = "bounce_handler_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "handle-bounced-service-email.handler"
  timeout          = "60"
  memory_size      = "768"

  runtime = var.node_version


  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_lambda_permission" "allow_sns" {
  count         = var.create_bounce_handler
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.zip_handle_bounce[0].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${var.account_id}:bounced_service_emails_${var.environment}"
}
