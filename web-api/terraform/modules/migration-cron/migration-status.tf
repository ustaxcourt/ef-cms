data "aws_caller_identity" "current" {}

module "migration_status_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/migration/migration-status.ts"
  handler_method = "handler"
  lambda_name    = "migration_status_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_status_role_${var.environment}"
  timeout        = "900"
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    AWS_ACCOUNT_ID            = data.aws_caller_identity.current.account_id
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
    MIGRATE_FLAG              = var.migrate_flag
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
  }
}

resource "aws_cloudwatch_event_rule" "check_migration_status_cron_rule" {
  name                = "check_migration_status_cron_${var.environment}"
  schedule_expression = "rate(2 minutes)"
  state               = "DISABLED"
}

resource "aws_cloudwatch_event_target" "check_migration_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_migration_status_cron_rule.name
  target_id = module.migration_status_lambda.function_name
  arn       = module.migration_status_lambda.arn
}

resource "terraform_data" "migration_status_lambda_last_modified" {
  input = module.migration_status_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_migration_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.migration_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_migration_status_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.migration_status_lambda_last_modified
    ]
  }
}

