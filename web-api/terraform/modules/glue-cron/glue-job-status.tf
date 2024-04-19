data "aws_caller_identity" "current" {}

resource "aws_iam_role" "glue_job_status_role" {
  name = "glue_job_status_role_${var.environment}"

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

resource "aws_iam_role_policy" "glue_job_status_policy" {
  name = "glue_job_status_policy_${var.environment}"
  role = aws_iam_role.glue_job_status_role.id

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
      "Action": [
        "glue:GetJobRuns"
      ],
      "Resource": [
        "arn:aws:glue:us-east-1:${data.aws_caller_identity.current.account_id}:job/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}


module "glue_job_status_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/glue-cron/glue-job-status.ts"
  handler_method = "handler"
  lambda_name    = "glue_job_status_lambda_${var.environment}"
  role           = aws_iam_role.glue_job_status_role.arn
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    ACCOUNT_ID                = data.aws_caller_identity.current.account_id
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
  }
  timeout = "29"
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

resource "terraform_data" "glue_job_status_lambda_last_modified" {
  input = module.glue_job_status_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_glue_job_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.glue_job_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_glue_job_status_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.glue_job_status_lambda_last_modified
    ]
  }
}
