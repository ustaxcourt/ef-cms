module "check_case_cron_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cases/checkForReadyForTrialCasesLambda.ts"
  handler_method = "checkForReadyForTrialCasesLambda"
  lambda_name    = "check_case_cron_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "3008"
}


module "health_check_cron_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/health/setHealthCheckCacheLambda.ts"
  handler_method = "setHealthCheckCacheLambda"
  lambda_name    = "health_check_cron_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "3008"
}

resource "aws_cloudwatch_event_rule" "check_case_cron_rule" {
  count               = var.create_check_case_cron
  name                = "check_case_cron_${var.environment}_${var.current_color}"
  schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_rule" "health_check_cron_rule" {
  count               = var.create_health_check_cron
  name                = "health_check_cron_${var.environment}_${var.current_color}"
  schedule_expression = "cron(0/1 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_case_cron_target" {
  count     = var.create_check_case_cron
  rule      = aws_cloudwatch_event_rule.check_case_cron_rule[0].name
  target_id = module.check_case_cron_lambda.function_name
  arn       = module.check_case_cron_lambda.arn
}

resource "aws_cloudwatch_event_target" "health_check_cron_target" {
  count     = var.create_health_check_cron
  rule      = aws_cloudwatch_event_rule.health_check_cron_rule[0].name
  target_id = module.health_check_cron_lambda[0].function_name
  arn       = module.health_check_cron_lambda[0].arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_case_lambda" {
  count         = var.create_check_case_cron
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.check_case_cron_lambda[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_case_cron_rule[0].arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_health_check_lambda" {
  count         = var.create_health_check_cron
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.health_check_cron_lambda[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.health_check_cron_rule[0].arn
}

