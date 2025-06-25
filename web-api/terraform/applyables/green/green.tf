provider "aws" {
  region = "us-east-1"
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
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.99.1"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_sns_topic" "system_health_alarms_east" {
  // account-level resource
  name = "system_health_alarms"
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

data "aws_dynamodb_table" "green_dynamo_table" {
  name = var.green_table_name
}

resource "terraform_data" "locals" {
  input = {
    AWS_ACCOUNT_ID                     = data.aws_caller_identity.current.account_id
    BOUNCE_ALERT_RECIPIENTS            = var.bounce_alert_recipients
    BOUNCE_ALERT_TEMPLATE              = "bounce_alert_${var.environment}"
    BOUNCED_EMAIL_RECIPIENT            = var.bounced_email_recipient
    COGNITO_SUFFIX                     = var.cognito_suffix
    COGNITO_CLIENT_ID                  = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_client_id
    DEFAULT_ACCOUNT_PASS               = var.default_account_pass
    DISABLE_EMAILS                     = var.disable_emails
    EFCMS_DOMAIN                       = var.dns_domain
    EMAIL_CHANGE_VERIFICATION_TEMPLATE = "email_change_verification_${var.environment}"
    EMAIL_DOCUMENT_SERVED_TEMPLATE     = "document_served_${var.environment}"
    EMAIL_SERVED_PETITION_TEMPLATE     = "petition_served_${var.environment}"
    EMAIL_SOURCE                       = "U.S. Tax Court <noreply@${var.dns_domain}>"
    IRS_SUPERUSER_EMAIL                = var.irs_superuser_email
    LOG_LEVEL                          = "info"
    MASTER_REGION                      = "us-east-1"
    NODE_ENV                           = "production"
    PROD_ENV_ACCOUNT_ID                = var.prod_env_account_id
    SLACK_WEBHOOK_URL                  = var.slack_webhook_url
    STAGE                              = var.environment
    USER_POOL_ID                       = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_id
    USER_POOL_IRS_ID                   = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_irs_id
    POSTGRES_HOST                      = data.terraform_remote_state.remote.outputs.rds_host_name
    POSTGRES_USER                      = data.terraform_remote_state.remote.outputs.postgres_user
    DATABASE_NAME                      = data.terraform_remote_state.remote.outputs.database_name
  }
}

module "lambda_role_green" {
  source        = "../../modules/lambda-role"
  role_name     = "lambda_role_${var.environment}_green"
  environment   = var.environment
  dns_domain    = var.dns_domain
  postgres_user = data.terraform_remote_state.remote.outputs.postgres_user
}

module "ecr-green-east" {
  source      = "../../modules/elastic-container-registry"
  environment = var.environment
  region      = "us-east-1"
  color       = "green"
  providers = {
    aws = aws.us-east-1
  }
}

module "zip_batch_east" {
  source        = "../../modules/batch"
  environment   = var.environment
  dns_domain    = var.dns_domain
  region        = "us-east-1"
  current_color = "green"

  providers = {
    aws = aws.us-east-1
  }
}

module "api-east-green" {
  source              = "../../modules/api"
  alert_sns_topic_arn = data.aws_sns_topic.system_health_alarms_east.arn
  environment         = var.environment
  pool_arn            = data.terraform_remote_state.remote.outputs.aws_cognito_user_pool_arn
  dns_domain          = var.dns_domain
  zone_id             = data.aws_route53_zone.zone.id
  lambda_role_arn     = module.lambda_role_green.role_arn
  lambda_environment = merge(terraform_data.locals.output, {
    CURRENT_COLOR          = "green"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_beta : data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_alpha
    REGION                 = "us-east-1"
    DISABLE_HTTP_TRAFFIC   = "true"
  })
  region = "us-east-1"
  providers = {
    aws           = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color          = "green"
  lambda_bucket_id       = data.terraform_remote_state.remote.outputs.api_lambdas_bucket_east_id
  create_check_case_cron = 1
  create_streams         = 1
  stream_arn             = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn            = data.terraform_remote_state.remote.outputs.east_web_acl_arn

  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  prod_env_account_id  = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler = 1
}

module "worker-east-green" {
  source              = "../../modules/worker"
  lambda_role_arn     = module.lambda_role_green.role_arn
  color               = "green"
  alert_sns_topic_arn = data.aws_sns_topic.system_health_alarms_east.arn
  lambda_environment = merge(terraform_data.locals.output, {
    CURRENT_COLOR          = "green"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_beta : data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_alpha
    REGION                 = "us-east-1"
  })
  providers = {
    aws = aws.us-east-1
  }
  environment = var.environment
}

module "opensearch-sync-east-green" {
  source              = "../../modules/opensearch-sync"
  lambda_role_arn     = module.lambda_role_green.role_arn
  color               = "green"
  alert_sns_topic_arn = data.aws_sns_topic.system_health_alarms_east.arn
  lambda_environment = merge(terraform_data.locals.output, {
    CURRENT_COLOR          = "green"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_beta : data.terraform_remote_state.remote.outputs.elasticsearch_endpoint_alpha
    REGION                 = "us-east-1"
  })
  providers = {
    aws = aws.us-east-1
  }
  environment = var.environment
}

module "ui-green" {
  source                 = "../../modules/ui"
  current_color          = "green"
  environment            = var.environment
  dns_domain             = var.dns_domain
  zone_name              = var.zone_name
  viewer_protocol_policy = var.viewer_protocol_policy

  providers = {
    aws           = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}
