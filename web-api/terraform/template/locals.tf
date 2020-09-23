data "null_data_source" "locals" {
  inputs = {
    S3_ENDPOINT                    = "s3.us-east-1.amazonaws.com"
    DOCUMENTS_BUCKET_NAME          = "${var.dns_domain}-documents-${var.environment}-us-east-1"
    TEMP_DOCUMENTS_BUCKET_NAME     = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    DYNAMODB_ENDPOINT              = "dynamodb.us-east-1.amazonaws.com"
    MASTER_DYNAMODB_ENDPOINT       = "dynamodb.us-east-1.amazonaws.com"
    MASTER_REGION                  = "us-east-1"
    STAGE                          = var.environment
    USER_POOL_ID                   = aws_cognito_user_pool.pool.id
    USER_POOL_IRS_ID               = aws_cognito_user_pool.irs_pool.id
    NODE_ENV                       = "production"
    EMAIL_SOURCE                   = "noreply@mail.${var.dns_domain}"
    EMAIL_DOCUMENT_SERVED_TEMPLATE = "document_served_${var.environment}"
    EMAIL_SERVED_PETITION_TEMPLATE = "petition_served_${var.environment}"
    EFCMS_DOMAIN                   = var.dns_domain
    CLAMAV_DEF_DIR                 = "/opt/var/lib/clamav"
    CIRCLE_HONEYBADGER_API_KEY     = var.honeybadger_key
    IRS_SUPERUSER_EMAIL            = var.irs_superuser_email
    COGNITO_SUFFIX                 = var.cognito_suffix
  }
}
