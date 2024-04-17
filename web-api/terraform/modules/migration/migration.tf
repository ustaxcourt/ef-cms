module "migration_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/migration/migration.ts"
  handler_method = "handler"
  lambda_name    = "migration_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_role_${var.environment}"
  environment = {
    DESTINATION_TABLE      = var.destination_table
    STAGE                  = var.environment
    NODE_ENV               = "production"
    SOURCE_TABLE           = var.source_table
    ACCOUNT_ID             = data.aws_caller_identity.current.account_id
    DOCUMENTS_BUCKET_NAME  = var.documents_bucket_name
    S3_ENDPOINT            = "s3.us-east-1.amazonaws.com"
    ELASTICSEARCH_ENDPOINT = var.elasticsearch_domain
  }
  timeout = "30"
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn              = var.stream_arn
  function_name                 = module.migration_lambda.arn
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
