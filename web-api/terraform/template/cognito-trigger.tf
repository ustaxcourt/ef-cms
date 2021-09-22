data "archive_file" "zip_triggers" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/cognito-triggers.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api.js",
    "api-public.js",
    "websockets.js",
    "maintenance-notify.js",
    "cron.js",
    "streams.js",
    "cognito-authorizer.js",
    "report.html"
  ]
}

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
  memory_size      = "3008"
  runtime          = "nodejs14.x"

  layers = [
    module.api-east-blue.puppeteer_layer_arn
  ]

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
  memory_size      = "3008"
  runtime          = "nodejs14.x"

  layers = [
    module.api-east-blue.puppeteer_layer_arn
  ]

  # These can not use null_data_source.locals due to circular dep
  environment {
    variables = {
      AWS_ACCOUNT_ID                     = data.aws_caller_identity.current.account_id
      BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
      CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
      DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
      DYNAMODB_TABLE_NAME                = var.destination_table
      EFCMS_DOMAIN                       = var.dns_domain
      EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
      EMAIL_SOURCE                       = "noreply@${var.dns_domain}"
      IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
      MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
      MASTER_REGION                      = "us-east-1"
      NODE_ENV                           = "production"
      QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
      S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
      STAGE                              = var.environment
      TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    }
  }
}


resource "aws_lambda_function" "update_petitioner_cases_lambda" {
  filename         = data.archive_file.zip_triggers.output_path
  function_name    = "update_petitioner_cases_lambda_${var.environment}"
  # TODO: create a separate role for this
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_update_petitioner_cases_lambda_role_${var.environment}"
  handler          = "cognito-triggers.updatePetitionerCasesLambda"
  source_code_hash = data.archive_file.zip_triggers.output_base64sha256
  timeout          = "29"
  memory_size      = "3008"
  runtime          = "nodejs14.x"

  layers = [
    module.api-east-blue.puppeteer_layer_arn
  ]

  # These can not use null_data_source.locals due to circular dep
  environment {
    variables = {
      AWS_ACCOUNT_ID                     = data.aws_caller_identity.current.account_id
      BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
      CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
      DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
      DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
      DYNAMODB_TABLE_NAME                = var.destination_table
      EFCMS_DOMAIN                       = var.dns_domain
      EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
      EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
      EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
      EMAIL_SOURCE                       = "noreply@${var.dns_domain}"
      IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
      MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
      MASTER_REGION                      = "us-east-1"
      NODE_ENV                           = "production"
      QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
      S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
      STAGE                              = var.environment
      TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    }
  }
}


resource "aws_sqs_queue" "update_petitioner_cases_queue" {
  name = "update_petitioner_cases_queue_${var.environment}"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.update_petitioner_cases_dl_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_lambda_event_source_mapping" "update_petitioner_cases_mapping" {
  event_source_arn = aws_sqs_queue.update_petitioner_cases_queue.arn
  function_name    = aws_lambda_function.update_petitioner_cases_lambda.arn
  batch_size       = 1
}

resource "aws_sqs_queue" "update_petitioner_cases_dl_queue" {
  name = "update_petitioner_cases_dl_queue_${var.environment}"
}
