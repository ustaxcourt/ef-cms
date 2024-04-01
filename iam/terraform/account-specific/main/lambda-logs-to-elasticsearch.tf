module "logs_to_es" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./aws/lambdas/LogsToElasticSearch_info/index.js"
  handler_method = "handler"
  lambda_name    = "LogsToElasticSearch_info"
  role           = aws_iam_role.lambda_elasticsearch_execution_role.arn
  environment = {
    es_endpoint = aws_opensearch_domain.efcms-logs.endpoint
  }
  timeout     = "900"
  memory_size = "3008"
}

resource "aws_cloudwatch_log_group" "logs_to_elasticsearch" {
  name              = "/aws/lambda/${module.logs_to_es.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.logs_to_es.function_name
  principal     = "logs.amazonaws.com"
  lifecycle {
    replace_triggered_by = [
      module.logs_to_es.last_modified
    ]
  }
}


module "regional-log-subscription-filters-east" {
  source                           = "./regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = module.logs_to_es.arn

  providers = {
    aws = aws.us-east-1
  }
}

module "regional-log-subscription-filters-west" {
  source                           = "./regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = module.logs_to_es.arn

  providers = {
    aws = aws.us-west-1
  }
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count           = length(var.log_group_environments)
  destination_arn = module.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_authorizer_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/cognito_authorizer_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_post_authentication_lambda_filter" {
  count           = length(var.log_group_environments)
  destination_arn = module.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_post_authentication_lambda_${element(var.log_group_environments, count.index)}_filter"
  log_group_name  = "/aws/lambda/cognito_post_authentication_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "clamav_fargate_filter" {
  count           = length(var.log_group_environments)
  destination_arn = module.logs_to_es.arn
  filter_pattern  = ""
  name            = "clamav_fargate_${element(var.log_group_environments, count.index)}_filter"
  log_group_name  = "/aws/ecs/clamav_fargate_${element(var.log_group_environments, count.index)}"
}
