data "archive_file" "switch_colors_status_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/switch-colors.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
  excludes = ["migration.js", "migration-segments.js"]
}

resource "aws_lambda_function" "switch_colors_status_lambda" {
  filename         = data.archive_file.switch_colors_status_zip.output_path
  function_name    = "switch_colors_status_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler          = "switch-colors-status.handler"
  source_code_hash = data.archive_file.switch_colors_status_zip.output_base64sha256

  runtime     = "nodejs18.x"
  timeout     = "900"
  memory_size = "768"

  environment {
    variables = {
      STAGE                         = var.environment
      NODE_ENV                      = "production"
      ACCOUNT_ID                    = data.aws_caller_identity.current.account_id
      CIRCLE_MACHINE_USER_TOKEN     = var.circle_machine_user_token
      CIRCLE_WORKFLOW_ID            = var.circle_workflow_id
    }
  }
}

resource "aws_cloudwatch_event_rule" "check_switch_colors_status_cron_rule-sunday" {
  name                = "check_switch_colors_status_cron_${var.environment}"
  schedule_expression = "cron(* 5,6 ? * SUN *)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "check_switch_colors_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_switch_colors_status_cron_rule-sunday.name
  target_id = aws_lambda_function.switch_colors_status_lambda.function_name
  arn       = aws_lambda_function.switch_colors_status_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_switch_colors_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.switch_colors_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_switch_colors_status_cron_rule-sunday.arn
}
