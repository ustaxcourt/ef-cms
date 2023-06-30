data "archive_file" "empty_s3_bucket_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/empty-s3-bucket.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
}

resource "aws_lambda_function" "empty_s3_bucket_lambda" {
  filename         = data.archive_file.empty_s3_bucket_zip.output_path
  function_name    = "empty_s3_bucket_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/empty_s3_bucket_role_${var.environment}"
  handler          = "empty-s3-bucket.handler"
  source_code_hash = data.archive_file.empty_s3_bucket_zip.output_base64sha256

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
      DOCUMENTS_BUCKET_NAME     = var.documents_bucket_name
      S3_ENDPOINT               = "s3.us-east-1.amazonaws.com"
    }
  }
}

resource "aws_cloudwatch_event_rule" "empty_s3_bucket_cron_rule" {
  name                = "empty_s3_bucket_cron_${var.environment}"
  schedule_expression = "rate(15 minutes)"
  is_enabled          = "false"
}

resource "aws_cloudwatch_event_target" "empty_s3_bucket_cron_target" {
  rule      = aws_cloudwatch_event_rule.empty_s3_bucket_cron_rule.name
  target_id = aws_lambda_function.empty_s3_bucket_lambda.function_name
  arn       = aws_lambda_function.empty_s3_bucket_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_empty_s3_bucket_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.empty_s3_bucket_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.empty_s3_bucket_cron_rule.arn
}
