
data "archive_file" "migration_segments_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/migration-segments.js.zip"
  source_file = "${path.module}/lambdas/dist/migration-segments.js"
}

resource "aws_lambda_function" "migration_segments_lambda" {
  filename         = data.archive_file.migration_segments_zip.output_path
  function_name    = "migration_segments_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_segments_role_${var.environment}"
  handler          = "migration-segments.handler"
  source_code_hash = data.archive_file.migration_segments_zip.output_base64sha256

  runtime     = "nodejs12.x"
  timeout     = "60"
  memory_size = "768"

  environment {
    variables = {
      SOURCE_TABLE       = var.source_table
      ENVIRONMENT        = var.environment
      SEGMENTS_QUEUE_URL = aws_sqs_queue.migration_segments_queue.id
      DESTINATION_TABLE  = var.destination_table
    }
  }
}

resource "aws_lambda_event_source_mapping" "segments_mapping" {
  event_source_arn = aws_sqs_queue.migration_segments_queue.arn
  function_name    = aws_lambda_function.migration_segments_lambda.arn
  batch_size       = 1
}
