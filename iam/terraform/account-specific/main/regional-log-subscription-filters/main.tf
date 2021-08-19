resource "aws_cloudwatch_log_subscription_filter" "api_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "api_public_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_public_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_public_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_public_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_public_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_public_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "api_async_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_async_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_async_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_async_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_async_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_async_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "streams_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "streams_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/streams_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "streams_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "streams_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/streams_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "migration_lambda_filter" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "migration_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/migration_segments_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "api_stage_logs_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_stage_logs_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "api_public_stage_logs_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_public_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_public_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_public_stage_logs_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "api_public_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_public_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "websockets_connect_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "websockets_connect_${element(var.log_group_environments, count.index)}_blue_filter"
  log_group_name  = "/aws/lambda/websockets_connect_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "websockets_connect_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "websockets_connect_${element(var.log_group_environments, count.index)}_green_filter"
  log_group_name  = "/aws/lambda/websockets_connect_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "websockets_disconnect_blue" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "websockets_disconnect_${element(var.log_group_environments, count.index)}_blue_filter"
  log_group_name  = "/aws/lambda/websockets_disconnect_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "websockets_disconnect_green" {
  count           = length(var.log_group_environments)
  destination_arn = var.logs_to_elasticsearch_lambda_arn
  filter_pattern  = ""
  name            = "websockets_disconnect_${element(var.log_group_environments, count.index)}_green_filter"
  log_group_name  = "/aws/lambda/websockets_disconnect_${element(var.log_group_environments, count.index)}_green"
}
