module "check_case_cron_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cases/checkForReadyForTrialCasesLambda.ts"
  handler_method = "checkForReadyForTrialCasesLambda"
  lambda_name    = "check_case_cron_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "3008"
}

resource "aws_cloudwatch_event_rule" "check_case_cron_rule" {
  count               = var.create_check_case_cron
  name                = "check_case_cron_${var.environment}_${var.current_color}"
  schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_case_cron_target" {
  count     = var.create_check_case_cron
  rule      = aws_cloudwatch_event_rule.check_case_cron_rule[0].name
  target_id = module.check_case_cron_lambda.function_name
  arn       = module.check_case_cron_lambda.arn
}

resource "terraform_data" "check_case_cron_lambda_last_modified" {
  input = module.check_case_cron_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_case_lambda" {
  count         = var.create_check_case_cron
  statement_id  = "AllowExecutionFromCloudWatch_${var.environment}_${var.current_color}"
  action        = "lambda:InvokeFunction"
  function_name = module.check_case_cron_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_case_cron_rule[0].arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.check_case_cron_lambda_last_modified
    ]
  }
}
