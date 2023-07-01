data "archive_file" "sync_s3_buckets_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/sync-s3-buckets.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
}

resource "aws_lambda_function" "sync_s3_buckets_lambda" {
  filename         = data.archive_file.sync_s3_buckets_zip.output_path
  function_name    = "sync_s3_buckets_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/s3_lambda_role_${var.environment}"
  handler          = "sync-s3-buckets.handler"
  source_code_hash = data.archive_file.sync_s3_buckets_zip.output_base64sha256

  runtime     = "nodejs18.x"
  timeout     = "890"
  memory_size = "768"

  environment {
    variables = {
      STAGE                     = var.environment
      NODE_ENV                  = "production"
      AWS_ACCOUNT_ID            = data.aws_caller_identity.current.account_id
      CIRCLE_WORKFLOW_ID        = var.circle_workflow_id
      CIRCLE_MACHINE_USER_TOKEN = var.circle_machine_user_token
      DESTINATION_BUCKET_NAME   = var.destination_bucket_name
      SOURCE_BUCKET_NAME        = var.source_bucket_name
    }
  }
}

resource "aws_cloudwatch_event_rule" "sync_s3_buckets_cron_rule" {
  name                = "sync_s3_buckets_cron_${var.environment}"
  schedule_expression = "rate(15 minutes)"
  is_enabled          = "false"
}

resource "aws_cloudwatch_event_target" "sync_s3_buckets_cron_target" {
  rule      = aws_cloudwatch_event_rule.sync_s3_buckets_cron_rule.name
  target_id = aws_lambda_function.sync_s3_buckets_lambda.function_name
  arn       = aws_lambda_function.sync_s3_buckets_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_sync_s3_buckets_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_s3_buckets_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sync_s3_buckets_cron_rule.arn
}
