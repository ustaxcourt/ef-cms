module "reindex_status_lambda" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-api/workflow-terraform/reindex-cron/main/lambdas/reindex-status.ts"
  handler_method = "handler"
  lambda_name    = "reindex_status_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/reindex_status_role_${var.environment}"
  timeout        = "900"
  environment = {
    ACCOUNT_ID                = data.aws_caller_identity.current.account_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
    DEPLOYMENT_TIMESTAMP      = var.deployment_timestamp
    DESTINATION_TABLE         = var.destination_table
    MIGRATE_FLAG              = var.migrate_flag
    NODE_ENV                  = "production"
    SOURCE_TABLE              = var.source_table
    STAGE                     = var.environment
  }
}

resource "aws_cloudwatch_event_rule" "check_reindex_status_cron_rule" {
  name                = "check_reindex_status_cron_${var.environment}"
  schedule_expression = "rate(1 minute)"
  state               = "DISABLED"
}

resource "aws_cloudwatch_event_target" "check_reindex_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_reindex_status_cron_rule.name
  target_id = module.reindex_status_lambda.function_name
  arn       = module.reindex_status_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_reindex_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.reindex_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_reindex_status_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      module.reindex_status_lambda.lambda_function
    ]
  }
}

