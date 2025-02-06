data "aws_caller_identity" "current" {}

resource "aws_iam_role" "stale_cases_email_lambda_role" {
  name = "stale_cases_email_cron_lambda_role_${var.environment}"

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


resource "aws_iam_role_policy" "stale_cases_email_lambda_policy" {
  name = "stale_cases_email_lambda_policy_${var.environment}"
  role = aws_iam_role.stale_cases_email_lambda_role.id

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
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "es:ESHttpDelete",
        "es:ESHttpGet",
        "es:ESHttpPost",
        "es:ESHttpPut"
      ],
      "Resource": [
        "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-${var.environment}-*"
      ]
    },
    {
      "Effect":"Allow",
      "Action":[
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}

module "stale_cases_email_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/staleCasesEmail/staleCasesEmailLambda.ts"
  handler_method = "handler"
  lambda_name    = "stale_cases_email_lambda_${var.environment}"
  role           = aws_iam_role.stale_cases_email_lambda_role.arn
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

resource "aws_cloudwatch_event_rule" "stale_cases_email_cron_rule-monthly" {
  name                = "stale_cases_email_cron_${var.environment}"
  schedule_expression = "cron(0 9 1 * ? *)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "stale_cases_email_cron_target" {
  rule      = aws_cloudwatch_event_rule.stale_cases_email_cron_rule-monthly.name
  target_id = module.stale_cases_email_lambda.function_name
  arn       = module.stale_cases_email_lambda.arn
}

resource "terraform_data" "stale_cases_email_lambda_last_modified" {
  input = module.stale_cases_email_lambda.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_stale_cases_email_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.stale_cases_email_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.stale_cases_email_cron_rule-monthly.arn

  lifecycle {
    replace_triggered_by = [
      terraform_data.stale_cases_email_lambda_last_modified
    ]
  }
}
