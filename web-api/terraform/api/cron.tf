resource "aws_lambda_function" "check_case_cron_lambda" {
  count            = var.create_cron
  depends_on       = [var.cron_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "cron_${var.current_color}.js.zip"
  source_code_hash = var.cron_object_hash
  function_name    = "check_case_cron_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "cron.checkForReadyForTrialCasesHandler"
  timeout          = "900"
  memory_size      = "3008"

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_cloudwatch_event_rule" "check_case_cron_rule" {
  count               = var.create_cron
  name                = "check_case_cron_${var.environment}_${var.current_color}"
  schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_case_cron_target" {
  count     = var.create_cron
  rule      = aws_cloudwatch_event_rule.check_case_cron_rule[0].name
  target_id = aws_lambda_function.check_case_cron_lambda[0].function_name
  arn       = aws_lambda_function.check_case_cron_lambda[0].arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_case_lambda" {
  count         = var.create_cron
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.check_case_cron_lambda[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_case_cron_rule[0].arn
}
