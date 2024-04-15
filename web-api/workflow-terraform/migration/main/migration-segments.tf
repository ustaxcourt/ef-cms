
data "archive_file" "migration_segments_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/migration-segments.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
  excludes    = ["migration.js"]
}

resource "aws_lambda_function" "migration_segments_lambda" {
  filename         = data.archive_file.migration_segments_zip.output_path
  function_name    = "migration_segments_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_segments_role_${var.environment}"
  handler          = "migration-segments.handler"
  source_code_hash = data.archive_file.migration_segments_zip.output_base64sha256

  runtime     = "nodejs18.x"
  timeout     = "900"
  memory_size = "768"

  environment {
    variables = {
      DESTINATION_TABLE      = var.destination_table
      STAGE                  = var.environment
      NODE_ENV               = "production"
      SEGMENTS_QUEUE_URL     = aws_sqs_queue.migration_segments_queue.id
      SOURCE_TABLE           = var.source_table
      ACCOUNT_ID             = data.aws_caller_identity.current.account_id
      ELASTICSEARCH_ENDPOINT = var.elasticsearch_domain
    }
  }
}

resource "aws_lambda_event_source_mapping" "segments_mapping" {
  event_source_arn = aws_sqs_queue.migration_segments_queue.arn
  function_name    = aws_lambda_function.migration_segments_lambda.arn
  batch_size       = 1
}
