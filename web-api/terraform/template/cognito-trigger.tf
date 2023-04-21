/*
TODO: This file can be removed after batch 9 is successfully deployed to prod

The reason we keep this around now is so that we can transition the triggers to a blue / green approach, but if we 
removed this file now, it would delete the trigger lambda and no one would be able to login until AFTER
the reindexing and color switch finishes.
*/

resource "aws_lambda_permission" "allow_trigger" {
  statement_id  = "AllowPostConfirmationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

resource "aws_lambda_permission" "allow_post_auth_trigger" {
  statement_id  = "AllowPostAuthenticationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_authentication_lambda.function_name
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
  runtime          = "nodejs18.x"

  lifecycle {
    ignore_changes = all
  }

  # These can not use null_data_source.locals due to circular dep
  environment {
    variables = {
      S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
      DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
      QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
      MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
      MASTER_REGION                      = "us-east-1"
      STAGE                              = var.environment
      NODE_ENV                           = "production"
      BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
      BOUNCE_ALERT_TEMPLATE              = "bounce_alert_${var.environment}"
      BOUNCE_ALERT_RECIPIENTS            = var.bounce_alert_recipients
      SLACK_WEBHOOK_URL                  = var.slack_webhook_url
      EMAIL_SOURCE                       = "noreply@${var.dns_domain}"
      EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
      EFCMS_DOMAIN                       = var.dns_domain
      CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
      IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
      DYNAMODB_TABLE_NAME                = var.cognito_table_name
    }
  }
}

resource "aws_lambda_function" "cognito_post_authentication_lambda" {
  filename         = data.archive_file.zip_triggers.output_path
  function_name    = "cognito_post_authentication_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_post_authentication_lambda_role_${var.environment}"
  handler          = "cognito-triggers.handler"
  source_code_hash = data.archive_file.zip_triggers.output_base64sha256
  timeout          = "29"
  runtime          = "nodejs18.x"

  lifecycle {
    ignore_changes = all
  }

  # These can not use null_data_source.locals due to circular dep
  environment {
    variables = {
      S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
      DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
      QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
      MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
      MASTER_REGION                      = "us-east-1"
      STAGE                              = var.environment
      NODE_ENV                           = "production"
      BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
      BOUNCE_ALERT_TEMPLATE              = "bounce_alert_${var.environment}"
      BOUNCE_ALERT_RECIPIENTS            = var.bounce_alert_recipients
      SLACK_WEBHOOK_URL                  = var.slack_webhook_url
      EMAIL_SOURCE                       = "noreply@${var.dns_domain}"
      EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
      EFCMS_DOMAIN                       = var.dns_domain
      CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
      IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
      DYNAMODB_TABLE_NAME                = var.destination_table
    }
  }
}
