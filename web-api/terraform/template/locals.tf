data "null_data_source" "locals" {
  inputs = {
    S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
    DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
    TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
    DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
    MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
    MASTER_REGION                      = "us-east-1"
    STAGE                              = var.environment
    USER_POOL_ID                       = aws_cognito_user_pool.pool.id
    USER_POOL_IRS_ID                   = aws_cognito_user_pool.irs_pool.id
    NODE_ENV                           = "production"
    BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
    EMAIL_SOURCE                       = "noreply@${var.dns_domain}"
    EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
    EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
    EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
    EFCMS_DOMAIN                       = var.dns_domain
    CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
    IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
    COGNITO_SUFFIX                     = var.cognito_suffix
    DISABLE_EMAILS                     = var.disable_emails
    LOG_LEVEL                          = var.log_level
    SCANNER_RESOURCE_URI               = var.scanner_resource_uri
  }
}
