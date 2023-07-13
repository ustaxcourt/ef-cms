data "archive_file" "process_s3_queue_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/process-s3-queue.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
}

resource "aws_lambda_function" "process_s3_queue_lambda" {
  filename         = data.archive_file.process_s3_queue_zip.output_path
  function_name    = "process_s3_queue_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/s3_lambda_role_${var.environment}"
  handler          = "process-s3-queue.handler"
  source_code_hash = data.archive_file.process_s3_queue_zip.output_base64sha256

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
      BUCKET_SHORT_NAME         = var.bucket_short_name
      DESTINATION_BUCKET_NAME   = var.destination_bucket_name
      SOURCE_BUCKET_NAME        = var.source_bucket_name
      S3_BUCKET_QUEUE_URL       = aws_sqs_queue.s3_bucket_queue.id
      S3_BUCKET_DL_QUEUE_URL    = aws_sqs_queue.s3_bucket_dl_queue.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "process_s3_queue_mapping" {
  event_source_arn = aws_sqs_queue.s3_bucket_queue.arn
  function_name    = aws_lambda_function.process_s3_queue_lambda.arn
  batch_size       = 1
}
