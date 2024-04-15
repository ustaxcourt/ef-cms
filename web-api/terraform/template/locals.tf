data "null_data_source" "locals" {
  inputs = {
    AWS_ACCOUNT_ID                     = data.aws_caller_identity.current.account_id
    BOUNCE_ALERT_RECIPIENTS            = var.bounce_alert_recipients
    BOUNCE_ALERT_TEMPLATE              = "bounce_alert_${var.environment}"
    BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
    CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
    COGNITO_SUFFIX                     = var.cognito_suffix
    COGNITO_CLIENT_ID                  = aws_cognito_user_pool_client.client.id
    DEFAULT_ACCOUNT_PASS               = var.default_account_pass
    DISABLE_EMAILS                     = var.disable_emails
    DYNAMODB_ENDPOINT                  = "dynamodb.us-east-1.amazonaws.com"
    EFCMS_DOMAIN                       = var.dns_domain
    EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
    EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
    EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
    EMAIL_SOURCE                       = "U.S. Tax Court <noreply@${var.dns_domain}>"
    IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
    LOG_LEVEL                          = var.log_level
    MASTER_DYNAMODB_ENDPOINT           = "dynamodb.us-east-1.amazonaws.com"
    MASTER_REGION                      = "us-east-1"
    NODE_ENV                           = "production"
    PROD_ENV_ACCOUNT_ID                = var.prod_env_account_id
    SCANNER_RESOURCE_URI               = var.scanner_resource_uri
    SLACK_WEBHOOK_URL                  = var.slack_webhook_url
    STAGE                              = var.environment
    USER_POOL_ID                       = aws_cognito_user_pool.pool.id
    USER_POOL_IRS_ID                   = aws_cognito_user_pool.irs_pool.id
  }
}
