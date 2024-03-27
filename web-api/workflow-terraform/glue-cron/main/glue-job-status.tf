module "glue_job_status_lambda" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-api/workflow-terraform/glue-cron/main/lambdas/glue-job-status.ts"
  handler_method = "handler"
  lambda_name    = "glue_job_status_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/glue_job_status_role_${var.environment}"
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    ACCOUNT_ID                = data.aws_caller_identity.current.account_id
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
  }
  timeout     = "29"
}

resource "aws_cloudwatch_event_rule" "check_glue_job_status_cron_rule" {
  name                = "check_glue_job_status_cron_${var.environment}"
  schedule_expression = "rate(1 minute)"
  state               = "DISABLED"
}

resource "aws_cloudwatch_event_target" "check_glue_job_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_glue_job_status_cron_rule.name
  target_id = module.glue_job_status_lambda.function_name
  arn       = module.glue_job_status_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_glue_job_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.glue_job_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_glue_job_status_cron_rule.arn
}
