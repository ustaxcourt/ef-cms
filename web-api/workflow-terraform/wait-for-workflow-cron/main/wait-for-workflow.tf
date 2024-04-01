

module "wait_for_workflow_lambda" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/wait-for-workflow.ts"
  handler_method = "handler"
  lambda_name    = "wait_for_workflow_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/wait_for_workflow_role_${var.environment}"
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    AWS_ACCOUNT_ID            = data.aws_caller_identity.current.account_id
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
    CIRCLE_PIPELINE_ID        = var.circle_pipeline_id
    APPROVAL_JOB_NAME         = var.approval_job_name
  }
  timeout = "29"
}

resource "aws_cloudwatch_event_rule" "wait_for_workflow_cron_rule" {
  name                = "wait_for_workflow_cron_${var.environment}"
  schedule_expression = "rate(1 minute)"
  state               = "DISABLED"
}

resource "aws_cloudwatch_event_target" "wait_for_workflow_cron_target" {
  rule      = aws_cloudwatch_event_rule.wait_for_workflow_cron_rule.name
  target_id = module.wait_for_workflow_lambda.function_name
  arn       = module.wait_for_workflow_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_wait_for_workflow_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.wait_for_workflow_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.wait_for_workflow_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      module.wait_for_workflow_lambda.last_modified
    ]
  }
}
