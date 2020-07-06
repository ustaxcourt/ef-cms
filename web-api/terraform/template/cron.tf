data "null_data_source" "locals" {
  inputs = {
    S3_ENDPOINT = "s3.us-east-1.amazonaws.com"
    DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-documents-${var.environment}-us-east-1"
    TEMP_DOCUMENTS_BUCKET_NAME = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
    MASTER_DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
    ELASTICSEARCH_ENDPOINT = aws_elasticsearch_domain.efcms-search.endpoint
    MASTER_REGION = "us-east-1"
    STAGE = var.environment
    USER_POOL_ID = aws_cognito_user_pool.pool.id
    USER_POOL_IRS_ID = aws_cognito_user_pool.irs_pool.id
    NODE_ENV = "production"
    EMAIL_SOURCE = "noreply@mail.efcms-${var.environment}.${var.dns_domain}"
    EMAIL_DOCUMENT_SERVED_TEMPLATE = "document_served_${var.environment}"
    EMAIL_SERVED_PETITION_TEMPLATE = "petition_served_${var.environment}"
    EFCMS_DOMAIN = var.dns_domain
    CLAMAV_DEF_DIR = "/opt/var/lib/clamav"
    CIRCLE_HONEYBADGER_API_KEY = var.honeybadger_key
    IRS_SUPERUSER_EMAIL = var.irs_superuser_email
  }
}

data "archive_file" "zip_cron" {
  type        = "zip"
  output_path = "${path.module}/lambdas/cron.js.zip"
  source_file = "${path.module}/lambdas/dist/cron.js"
}

resource "aws_lambda_function" "reprocess_cron_lambda" {
  filename      = data.archive_file.zip_cron.output_path
  function_name = "reprocess_cron_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "cron.reprocessFailedRecordsHandler"
  source_code_hash = data.archive_file.zip_cron.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_cloudwatch_event_rule" "reprocess_cron_rule" {
    name = "reprocess_cron_${var.environment}"
    schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "reprocess_cron_target" {
    rule = aws_cloudwatch_event_rule.reprocess_cron_rule.name
    target_id = aws_lambda_function.reprocess_cron_lambda.function_name
    arn = aws_lambda_function.reprocess_cron_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_reprocess_lambda" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.reprocess_cron_lambda.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.reprocess_cron_rule.arn
}





resource "aws_lambda_function" "check_case_cron_lambda" {
  filename      = data.archive_file.zip_cron.output_path
  function_name = "check_case_cron_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "cron.checkForReadyForTrialCasesHandler"
  source_code_hash = data.archive_file.zip_cron.output_base64sha256
  timeout = "29"
  memory_size = "3008"

  runtime = "nodejs12.x"

  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_cloudwatch_event_rule" "check_case_cron_rule" {
    name = "check_case_cron_${var.environment}"
    schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_case_cron_target" {
    rule = aws_cloudwatch_event_rule.check_case_cron_rule.name
    target_id = aws_lambda_function.check_case_cron_lambda.function_name
    arn = aws_lambda_function.check_case_cron_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_case_lambda" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.check_case_cron_lambda.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.check_case_cron_rule.arn
}