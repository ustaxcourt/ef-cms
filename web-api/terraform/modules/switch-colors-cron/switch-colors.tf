data "aws_caller_identity" "current" {}

resource "aws_iam_role" "switch_colors_lambda_role" {
  name = "lambda_role_${var.environment}"

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


resource "aws_iam_role_policy" "switch_colors_lambda_policy" {
  name = "lambda_policy_${var.environment}"
  role = aws_iam_role.lambda_role.id

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
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

module "switch_colors_status_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/switch-colors/switch-colors-cron.ts"
  handler_method = "handler"
  lambda_name    = "switch_colors_status_lambda_${var.environment}"
  role           = aws_iam_role.switch_colors_lambda_role.arn
  environment = {
    STAGE                     = var.environment
    NODE_ENV                  = "production"
    ACCOUNT_ID                = data.aws_caller_identity.current.account_id
    CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
    CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
  }
  timeout = "900"
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

resource "terraform_data" "switch_colors_status_lambda_last_modified" {
  input = module.switch_colors_status_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_switch_colors_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.switch_colors_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_switch_colors_status_cron_rule-sunday.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.switch_colors_status_lambda_last_modified
    ]
  }
}
