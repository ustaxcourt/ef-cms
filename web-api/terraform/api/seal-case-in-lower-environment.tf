resource "aws_lambda_function" "zip_seal" {
  count            = var.create_seal_in_lower
  depends_on       = [var.seal_in_lower_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "seal_in_lower_${var.current_color}.js.zip"
  source_code_hash = var.seal_in_lower_object_hash
  function_name    = "seal_in_lower_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = ".handler"
  timeout          = "60"
  memory_size      = "768"

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_lambda_permission" "allow_topic_to_seal" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.zip_seal.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${var.prod_env_account_id}:sealed_case_notifier"
}
