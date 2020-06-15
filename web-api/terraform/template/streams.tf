data "archive_file" "zip_streams" {
  type        = "zip"
  output_path = "${path.module}/streams/index.js.zip"
  source_file = "${path.module}/streams/dist/index.js"
}

resource "aws_lambda_function" "zip_lambda" {
  filename      = "${data.archive_file.zip_streams.output_path}"
  function_name = "api_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "index.handler"
  source_code_hash = "${data.archive_file.zip_streams.output_base64sha256}"
  timeout = "29"
  memory_size = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = {
      S3_ENDPOINT = "s3.us-east-1.amazonaws.com"
      DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      TEMP_DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
      MASTER_DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
      ELASTICSEARCH_ENDPOINT = "${aws_elasticsearch_domain.efcms-search.endpoint}"
      MASTER_REGION = "us-east-1"
      STAGE = "${var.environment}"
      USER_POOL_ID = "${aws_cognito_user_pool.pool.id}"
      USER_POOL_IRS_ID = "${aws_cognito_user_pool.irs_pool.id}"
      NODE_ENV = "production"
      EMAIL_SOURCE = "noreply@mail.efcms-${var.environment}.${var.dns_domain}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE = "petition_served_${var.environment}"
      EFCMS_DOMAIN = "${var.dns_domain}"
      CLAMAV_DEF_DIR = "/opt/var/lib/clamav"
      CIRCLE_HONEYBADGER_API_KEY = "${var.honeybadger_key}"
      IRS_SUPERUSER_EMAIL = "${var.irs_superuser_email}"
    }
  }
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn  = "${aws_dynamodb_table.efcms-east.stream_arn}"
  function_name     = "${aws_lambda_function.zip_lambda.arn}"
  starting_position = "TRIM_HORIZON"
}