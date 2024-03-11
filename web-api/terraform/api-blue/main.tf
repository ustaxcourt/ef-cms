
module "api-east-green" {
  api_object                = null_resource.api_east_object
  api_public_object         = null_resource.api_public_east_object
  websockets_object         = null_resource.websockets_east_object
  send_emails_object        = null_resource.send_emails_east_object
  trial_session_object      = null_resource.trial_session_east_object
  maintenance_notify_object = null_resource.maintenance_notify_east_object
  pdf_generation_object     = null_resource.pdf_generation_east_object
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  cron_object               = null_resource.cron_east_object
  streams_object            = null_resource.streams_east_object
  node_version              = var.green_node_version
  create_maintenance_notify = 1
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain
  authorizer_uri            = module.cognito_authorizer_lambda_east.invoke_arn
  websocket_authorizer_uri  = aws_lambda_function.websocket_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
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
  deploying_color                = var.deploying_color
  deployment_timestamp           = var.deployment_timestamp
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  public_object_hash             = data.aws_s3_bucket_object.api_public_green_east_object.etag
  api_object_hash                = data.aws_s3_bucket_object.api_green_east_object.etag
  pdf_generation_object_hash     = data.aws_s3_bucket_object.pdf_generation_green_east_object.etag
  send_emails_object_hash        = data.aws_s3_bucket_object.send_emails_green_east_object.etag
  trial_session_object_hash      = data.aws_s3_bucket_object.trial_session_green_east_object.etag
  websockets_object_hash         = data.aws_s3_bucket_object.websockets_green_east_object.etag
  maintenance_notify_object_hash = data.aws_s3_bucket_object.maintenance_notify_green_east_object.etag
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_green_east_object.etag
  cron_object_hash               = data.aws_s3_bucket_object.cron_green_east_object.etag
  streams_object_hash            = data.aws_s3_bucket_object.streams_green_east_object.etag
  use_layers                     = var.green_use_layers
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  triggers_object                = null_resource.triggers_east_object
  triggers_object_hash           = data.aws_s3_bucket_object.triggers_green_east_object.etag
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  seal_in_lower_object      = null_resource.seal_in_lower_east_object
  seal_in_lower_object_hash = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? data.aws_s3_bucket_object.seal_in_lower_green_east_object.etag : ""
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  lower_env_account_id      = var.lower_env_account_id
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  bounce_handler_object      = null_resource.bounce_handler_east_object
  bounce_handler_object_hash = data.aws_s3_bucket_object.bounce_handler_green_east_object.etag
  create_bounce_handler      = 1
}