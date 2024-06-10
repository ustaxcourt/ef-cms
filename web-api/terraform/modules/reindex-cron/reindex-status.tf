data "aws_caller_identity" "current" {}

resource "aws_iam_role" "reindex_status_role" {
  name = "reindex_status_lambda_role_${var.environment}"

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

resource "aws_iam_role_policy" "reindex_status_policy" {
  name = "reindex_status_policy_${var.environment}"
  role = aws_iam_role.reindex_status_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ]
    },
    {
      "Sid": "Other",
      "Effect": "Allow",
      "Action": [
        "es:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}


module "reindex_status_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/reindex/reindex-status.ts"
  handler_method = "handler"
  lambda_name    = "reindex_status_lambda_${var.environment}"
  role           = aws_iam_role.reindex_status_role.arn
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

resource "terraform_data" "reindex_status_lambda_last_modified" {
  input = module.reindex_status_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_reindex_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.reindex_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_reindex_status_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.reindex_status_lambda_last_modified
    ]
  }
}

