resource "aws_lambda_function" "zip_seal" {
  count            = var.create_seal_in_lower
  depends_on       = [var.seal_in_lower_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "seal_in_lower_${var.current_color}.js.zip"
  source_code_hash = var.seal_in_lower_object_hash
  function_name    = "seal_in_lower_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "seal-in-lower-environment.handler"
  timeout          = "60"
  memory_size      = "768"

  runtime = var.node_version


  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_lambda_permission" "allow_topic_to_seal" {
  depends_on    = [aws_lambda_function.zip_seal]
  count         = var.create_seal_in_lower
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.zip_seal[0].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${var.prod_env_account_id}:seal_notifier"
}
