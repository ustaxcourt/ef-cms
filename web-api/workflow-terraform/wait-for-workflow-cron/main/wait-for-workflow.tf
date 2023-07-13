data "archive_file" "wait_for_workflow_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/wait-for-workflow.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
}

resource "aws_lambda_function" "wait_for_workflow_lambda" {
  filename         = data.archive_file.wait_for_workflow_zip.output_path
  function_name    = "wait_for_workflow_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/wait_for_workflow_role_${var.environment}"
  handler          = "wait-for-workflow.handler"
  source_code_hash = data.archive_file.wait_for_workflow_zip.output_base64sha256

  runtime     = "nodejs18.x"
  timeout     = "29"
  memory_size = "768"

  environment {
    variables = {
      STAGE                     = var.environment
      NODE_ENV                  = "production"
      AWS_ACCOUNT_ID            = data.aws_caller_identity.current.account_id
      CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
      CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
      CIRCLE_PIPELINE_ID        = var.circle_pipeline_id
      APPROVAL_JOB_NAME         = var.approval_job_name
    }
  }
}

resource "aws_cloudwatch_event_rule" "wait_for_workflow_cron_rule" {
  name                = "wait_for_workflow_cron_${var.environment}"
  schedule_expression = "rate(1 minute)"
  is_enabled          = "false"
}

resource "aws_cloudwatch_event_target" "wait_for_workflow_cron_target" {
  rule      = aws_cloudwatch_event_rule.wait_for_workflow_cron_rule.name
  target_id = aws_lambda_function.wait_for_workflow_lambda.function_name
  arn       = aws_lambda_function.wait_for_workflow_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_wait_for_workflow_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wait_for_workflow_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.wait_for_workflow_cron_rule.arn
}
