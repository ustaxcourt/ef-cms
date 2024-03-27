
module "switch_colors_status_lambda" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-api/workflow-terraform/switch-colors-cron/main/lambdas/switch-colors.ts"
  handler_method = "handler"
  lambda_name    = "switch_colors_status_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    ACCOUNT_ID                = data.aws_caller_identity.current.account_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
  }
  timeout     = "900"
}

resource "aws_cloudwatch_event_rule" "check_switch_colors_status_cron_rule-sunday" {
  name                = "check_switch_colors_status_cron_${var.environment}"
  schedule_expression = "cron(* 5,6 ? * SUN *)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "check_switch_colors_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_switch_colors_status_cron_rule-sunday.name
  target_id = module.switch_colors_status_lambda.function_name
  arn       = module.switch_colors_status_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_switch_colors_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.switch_colors_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_switch_colors_status_cron_rule-sunday.arn
}
