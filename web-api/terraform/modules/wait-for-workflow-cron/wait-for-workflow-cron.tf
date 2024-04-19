data "aws_caller_identity" "current" {}

resource "aws_iam_role" "wait_for_workflow_role" {
  name = "wait_for_workflow_role_${var.environment}"

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


resource "aws_iam_role_policy" "wait_for_workflow_policy" {
  name = "wait_for_workflow_policy_${var.environment}"
  role = aws_iam_role.wait_for_workflow_role.id

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
    }
  ]
}
EOF
}


module "wait_for_workflow_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/wait-for-workflow/wait-for-workflow-cron.ts"
  handler_method = "handler"
  lambda_name    = "wait_for_workflow_lambda_${var.environment}"
  role           = aws_iam_role.wait_for_workflow_role.arn
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

resource "terraform_data" "wait_for_workflow_lambda_last_modified" {
  input = module.wait_for_workflow_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_wait_for_workflow_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.wait_for_workflow_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.wait_for_workflow_cron_rule.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.wait_for_workflow_lambda_last_modified
    ]
  }
}
