
data "archive_file" "reindex_status_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/reindex-status.js.zip"
  source_dir  = "${path.module}/lambdas/dist/"
  excludes = ["migration.js", "migration-segments.js"]
}

resource "aws_lambda_function" "reindex_status_lambda" {
  filename         = data.archive_file.reindex_status_zip.output_path
  function_name    = "reindex_status_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/reindex_status_role_${var.environment}"
  handler          = "reindex_status.handler"
  source_code_hash = data.archive_file.reindex_status_zip.output_base64sha256

  runtime     = "nodejs14.x"
  timeout     = "900"
  memory_size = "768"

  environment {
    variables = {
      DESTINATION_TABLE     = var.destination_table
      ENVIRONMENT           = var.environment
      NODE_ENV              = "production"
      SOURCE_TABLE          = var.source_table
      ACCOUNT_ID            = data.aws_caller_identity.current.account_id
      DOCUMENTS_BUCKET_NAME = var.documents_bucket_name
      S3_ENDPOINT           = "s3.us-east-1.amazonaws.com"
    }
  }
}
