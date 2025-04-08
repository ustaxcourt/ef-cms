data "aws_caller_identity" "current" {}

resource "aws_iam_role" "rds_expired_records_cleanup_lambda_role" {
  name = "rds_expired_records_cleanup_lambda_role${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_role_policy" "rds_expired_records_cleanup_lambda_policy" {
  name = "rds_expired_records_cleanup_lambda_policy${var.environment}"
  role = aws_iam_role.rds_expired_records_cleanup_lambda_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
		//TODO DETERMINE WHAT ROLES TO GIVE LAMBDA
  ]
}
EOF
}

module "rds_expired_records_cleanup_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/rdsExpiredRecordsCleanup/rdsExpiredRecordsCleanupLambda.ts"
  handler_method = "handler"
  lambda_name    = "rds_expired_records_cleanup_lambda_${var.environment}"
  role           = aws_iam_role.rds_expired_records_cleanup_lambda_role.arn
  environment = {
    STAGE                        = var.environment
    NODE_ENV                     = "production"
    ACCOUNT_ID                   = data.aws_caller_identity.current.account_id
    DISABLE_EMAILS               = "false"
    ELASTICSEARCH_ENDPOINT       = var.elasticsearch_endpoint
    EMAIL_SOURCE                 = var.email_source
    INACTIVITY_REPORT_RECIPIENTS = var.inactivity_report_recipients
  }
  timeout = "900"
}

resource "aws_cloudwatch_event_rule" "rds_expired_records_cleanup_cron_rule_daily" {
  name                = "rds_expired_records_cleanup_cron_${var.environment}"
  schedule_expression = "cron(0 9 1 * ? *)" //UPDATE
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "rds_expired_records_cleanup_cron_target" {
  rule      = aws_cloudwatch_event_rule.rds_expired_records_cleanup_cron_rule_daily.name
  target_id = module.rds_expired_records_cleanup__lambda.function_name
  arn       = module.rds_expired_records_cleanup_lambda.arn
}

resource "terraform_data" "rds_expired_records_cleanup_lambda_last_modified" {
  input = module.rds_expired_records_cleanup_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_rds_expired_records_cleanup_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.rds_expired_records_cleanup_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.rds_expired_records_cleanup_cron_rule_daily.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.rds_expired_records_cleanup_lambda_last_modified
    ]
  }
}
