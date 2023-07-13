data "archive_file" "s3_queue_status_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/s3-queue-status.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
}

resource "aws_lambda_function" "s3_queue_status_lambda" {
  filename         = data.archive_file.s3_queue_status_zip.output_path
  function_name    = "s3_queue_status_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/s3_lambda_role_${var.environment}"
  handler          = "s3-queue-status.handler"
  source_code_hash = data.archive_file.s3_queue_status_zip.output_base64sha256

  runtime     = "nodejs18.x"
  timeout     = "900"
  memory_size = "768"

  environment {
    variables = {
      STAGE                     = var.environment
      NODE_ENV                  = "production"
      AWS_ACCOUNT_ID            = data.aws_caller_identity.current.account_id
      CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
      CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
      S3_BUCKET_QUEUE_URL       = var.s3_bucket_queue_url
      S3_BUCKET_DL_QUEUE_URL    = var.s3_bucket_dl_queue_url
      BUCKET_NAME               = var.bucket_name
      EMPTYING_BUCKET           = var.emptying_bucket
    }
  }
}

resource "aws_cloudwatch_event_rule" "check_s3_queue_status_cron_rule" {
  name                = "check_s3_queue_status_cron_${var.environment}"
  schedule_expression = "rate(2 minutes)"
  is_enabled          = "false"
}

resource "aws_cloudwatch_event_target" "check_s3_queue_status_cron_target" {
  rule      = aws_cloudwatch_event_rule.check_s3_queue_status_cron_rule.name
  target_id = aws_lambda_function.s3_queue_status_lambda.function_name
  arn       = aws_lambda_function.s3_queue_status_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_s3_queue_status_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.s3_queue_status_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.check_s3_queue_status_cron_rule.arn
}
