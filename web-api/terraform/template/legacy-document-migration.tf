data "archive_file" "legacy_documents_migration_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/legacy-documents-migration.js.zip"
  source_file = "${path.module}/lambdas/dist/legacy-documents-migration.js"
}

resource "aws_lambda_function" "legacy_documents_migration_lambda" {
  filename         = data.archive_file.legacy_documents_migration_zip.output_path
  function_name    = "legacy_documents_migration_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler          = "legacy-documents-migration.handler"
  source_code_hash = data.archive_file.legacy_documents_migration_zip.output_base64sha256

  runtime     = "nodejs12.x"
  timeout     = "60"
  memory_size = "768"

  environment {
    variables = {
      //TODO update all var and resource names to be the same as a part of DOD
      DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
      MIGRATE_LEGACY_DOCUMENTS_QUEUE_URL = aws_sqs_queue.migrate_legacy_documents_queue.id
      MASTER_REGION                      = "us-east-1"
      MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
      DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
      STAGE                              = var.environment
      DYNAMODB_TABLE_NAME                = var.destination_table
    }
  }
}

resource "aws_lambda_event_source_mapping" "legacy_documents_migration_mapping" {
  event_source_arn = aws_sqs_queue.migrate_legacy_documents_queue.arn
  function_name    = aws_lambda_function.legacy_documents_migration_lambda.arn
  batch_size       = 1
}
