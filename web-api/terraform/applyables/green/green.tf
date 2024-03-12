
module "api-east-green" {
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  node_version              = var.green_node_version
  source                    = "../../modules/api"
  environment               = var.environment
  dns_domain                = var.dns_domain
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  pool_arn                  = aws_cognito_user_pool.pool.arn
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "green"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws           = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "green"
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_green_east_object.etag
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler      = 1
}

module "api-west-green" {
  puppeteer_layer_object    = null_resource.puppeteer_layer_west_object
  source                    = "../../modules/api"
  environment               = var.environment
  dns_domain                = var.dns_domain
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "green"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-west-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-west-1"
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "green"
  node_version                   = var.green_node_version
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_west.id
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_green_west_object.etag
  pool_arn                       = aws_cognito_user_pool.pool.arn
  create_check_case_cron         = 0
  create_health_check_cron       = 1
  create_streams                 = 0
  stream_arn                     = ""
  web_acl_arn                    = module.api-west-waf.web_acl_arn
  create_triggers                = 0
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_west) > 0 ? aws_route53_health_check.failover_health_check_west[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower      = 0
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler      = 0
}