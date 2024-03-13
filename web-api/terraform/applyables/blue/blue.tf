

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}


terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.37.0"
  }
}

data "aws_caller_identity" "current" {}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

data "aws_sns_topic" "system_health_alarms_west" {
  // account-level resource
  name     = "system_health_alarms"
  provider = aws.us-west-1
}

data "terraform_remote_state" "remote" {
  backend = "s3"
  config = {
    bucket = var.all_colors_tfstate_bucket
    key    = var.all_colors_tfstate_key
    region = "us-east-1"
  }
}

data "aws_route53_zone" "zone" {
  name         = "${var.zone_name}."
  private_zone = "false"
}

data "null_data_source" "locals" {
  inputs = {
    AWS_ACCOUNT_ID                     = data.aws_caller_identity.current.account_id
    BOUNCE_ALERT_RECIPIENTS            = var.bounce_alert_recipients
    BOUNCE_ALERT_TEMPLATE              = "bounce_alert_${var.environment}"
    BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
    CLAMAV_DEF_DIR                     = "/opt/var/lib/clamav"
    COGNITO_SUFFIX                     = var.cognito_suffix
    COGNITO_CLIENT_ID                  = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_client_id
    DEFAULT_ACCOUNT_PASS               = var.default_account_pass
    DISABLE_EMAILS                     = var.disable_emails
    DOCUMENTS_BUCKET_NAME              = "${var.dns_domain}-documents-${var.environment}-us-east-1"
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
    QUARANTINE_BUCKET_NAME             = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
    S3_ENDPOINT                        = "s3.us-east-1.amazonaws.com"
    SCANNER_RESOURCE_URI               = var.scanner_resource_uri
    SLACK_WEBHOOK_URL                  = var.slack_webhook_url
    STAGE                              = var.environment
    TEMP_DOCUMENTS_BUCKET_NAME         = "${var.dns_domain}-temp-documents-${var.environment}-us-east-1"
    USER_POOL_ID                       = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_id
    USER_POOL_IRS_ID                   = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_irs_id
  }
}

data "aws_dynamodb_table" "blue_dynamo_table" {
  name = var.blue_table_name
}

module "api-east-blue" {
  source                 = "../../modules/api"
  alert_sns_topic_arn    = data.aws_sns_topic.system_health_alarms.arn
  environment            = var.environment
  pool_arn               = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_arn
  node_version           = var.blue_node_version
  dns_domain             = var.dns_domain
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "blue"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.blue_elasticsearch_domain)) > 0 ? data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_beta : data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_alpha
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws           = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color            = "blue"
  lambda_bucket_id         = data.terraform_remote_state.remote.outputs.api_lambdas_bucket_east_id
  create_check_case_cron   = 1
  create_health_check_cron = 1
  create_streams           = 1
  stream_arn               = data.aws_dynamodb_table.blue_dynamo_table.stream_arn
  web_acl_arn              = data.terraform_remote_state.remote.outputs.east_web_acl_arn
  enable_health_checks     = var.enable_health_checks
  health_check_id          = data.terraform_remote_state.remote.outputs.aws_route53_health_check_failover_east_id

  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  prod_env_account_id  = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler = 1
}
module "api-west-blue" {
  source                 = "../../modules/api"
  alert_sns_topic_arn   = data.aws_sns_topic.system_health_alarms_west.arn
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "blue"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-west-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.blue_elasticsearch_domain)) > 0 ? data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_beta : data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_alpha
    REGION                 = "us-west-1"
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws           = aws.us-west-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color            = "blue"
  node_version             = var.blue_node_version
  lambda_bucket_id         = data.terraform_remote_state.remote.outputs.api_lambdas_bucket_west_id
  create_check_case_cron   = 0
  create_health_check_cron = 1
  create_streams           = 0
  pool_arn                 = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_arn
  stream_arn               = ""
  web_acl_arn              = data.terraform_remote_state.remote.outputs.west_web_acl_arn
  create_triggers          = 0
  enable_health_checks     = var.enable_health_checks
  health_check_id          = data.terraform_remote_state.remote.outputs.aws_route53_health_check_failover_west_id


  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower = 0
  prod_env_account_id  = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler = 0
}
