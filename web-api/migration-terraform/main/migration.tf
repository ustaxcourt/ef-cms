
data "archive_file" "migration_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/migration.js.zip"
  source_file = "${path.module}/lambdas/dist/migration.js"
}

resource "aws_lambda_function" "migration_lambda" {
  filename         = data.archive_file.migration_zip.output_path
  function_name    = "migration_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_role_${var.environment}"
  handler          = "migration.handler"
  source_code_hash = data.archive_file.migration_zip.output_base64sha256

  runtime     = "nodejs14.x"
  timeout     = "30"
  memory_size = "768"

  environment {
    variables = {
      ACCOUNT_ID        = data.aws_caller_identity.current.account_id
      DESTINATION_TABLE = var.destination_table
      ENVIRONMENT       = var.environment
      NODE_ENV          = "production"
      SOURCE_TABLE      = var.source_table
    }
  }
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn              = var.stream_arn
  function_name                 = aws_lambda_function.migration_lambda.arn
  starting_position             = "LATEST"
  maximum_retry_attempts        = 30
  parallelization_factor        = 1
  maximum_record_age_in_seconds = 604800
  destination_config {
    on_failure {
      destination_arn = aws_sqs_queue.migration_failure_queue.arn
    }
  }
}
