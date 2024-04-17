data "aws_caller_identity" "current" {}

module "migration_segments_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/migration/migration-segments.ts"
  handler_method = "handler"
  lambda_name    = "migration_segments_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_segments_role_${var.environment}"
  environment = {
    DESTINATION_TABLE      = var.destination_table
    STAGE                  = var.environment
    NODE_ENV               = "production"
    SEGMENTS_QUEUE_URL     = aws_sqs_queue.migration_segments_queue.id
    SOURCE_TABLE           = var.source_table
    ACCOUNT_ID             = data.aws_caller_identity.current.account_id
    DOCUMENTS_BUCKET_NAME  = var.documents_bucket_name
    S3_ENDPOINT            = "s3.us-east-1.amazonaws.com"
    ELASTICSEARCH_ENDPOINT = var.elasticsearch_domain
  }
  timeout = "900"
}


resource "aws_lambda_event_source_mapping" "segments_mapping" {
  event_source_arn = aws_sqs_queue.migration_segments_queue.arn
  function_name    = module.migration_segments_lambda.arn
  batch_size       = 1
}
