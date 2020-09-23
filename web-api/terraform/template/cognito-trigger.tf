data "archive_file" "zip_triggers" {
  type        = "zip"
  source_file = "${path.module}/lambdas/dist/cognito-triggers.js"
  output_path = "${path.module}/lambdas/cognito-triggers.js.zip"
}

resource "aws_lambda_permission" "allow_trigger" {
  statement_id  = "AllowPostConfirmationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

resource "aws_lambda_function" "cognito_post_confirmation_lambda" {
  filename         = data.archive_file.zip_triggers.output_path
  function_name    = "cognito_post_confirmation_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_post_confirmation_lambda_role_${var.environment}"
  handler          = "cognito-triggers.handler"
  source_code_hash = data.archive_file.zip_triggers.output_base64sha256
  timeout          = "29"
  runtime          = "nodejs12.x"

  # These can not use null_data_source.locals due to circular dep
  environment {
    variables = {
      S3_ENDPOINT                    = "s3.us-east-1.amazonaws.com"
      DOCUMENTS_BUCKET_NAME          = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      TEMP_DOCUMENTS_BUCKET_NAME     = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT              = "dynamodb.us-east-1.amazonaws.com"
      MASTER_DYNAMODB_ENDPOINT       = "dynamodb.us-east-1.amazonaws.com"
      ELASTICSEARCH_ENDPOINT         = aws_elasticsearch_domain.efcms-search.endpoint
      MASTER_REGION                  = "us-east-1"
      STAGE                          = var.environment
      NODE_ENV                       = "production"
      EMAIL_SOURCE                   = "noreply@mail.${var.dns_domain}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE = "petition_served_${var.environment}"
      EFCMS_DOMAIN                   = var.dns_domain
      CLAMAV_DEF_DIR                 = "/opt/var/lib/clamav"
      CIRCLE_HONEYBADGER_API_KEY     = var.honeybadger_key
      IRS_SUPERUSER_EMAIL            = var.irs_superuser_email
    }
  }
}
