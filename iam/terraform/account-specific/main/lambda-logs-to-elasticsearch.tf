data "archive_file" "zip_logs_to_es_lambda" {
  type        = "zip"
  output_path = "${path.cwd}/../../../../aws/lambdas/LogsToElasticSearch_info.zip"
  source_file = "${path.cwd}/../../../../aws/lambdas/LogsToElasticSearch_info/index.js"
}

resource "aws_lambda_function" "logs_to_es" {
  filename      = data.archive_file.zip_logs_to_es_lambda.output_path
  function_name = "LogsToElasticSearch_info"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_elasticsearch_execution_role.arn
  runtime       = "nodejs14.x"

  source_code_hash = "${filebase64sha256(data.archive_file.zip_logs_to_es_lambda.output_path)}-${aws_iam_role.lambda_elasticsearch_execution_role.name}"

  environment {
    variables = {
      es_endpoint = aws_elasticsearch_domain.efcms-logs.endpoint
    }
  }
}

resource "aws_cloudwatch_log_group" "logs_to_elasticsearch" {
  name              = "/aws/lambda/${aws_lambda_function.logs_to_es.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logs_to_es.function_name
  principal     = "logs.amazonaws.com"
}


module "regional-log-subscription-filters-east" {
  source                           = "./regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = aws_lambda_function.logs_to_es.arn

  providers = {
    aws = aws.us-east-1
  }
}

module "regional-log-subscription-filters-west" {
  source                           = "./regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = aws_lambda_function.logs_to_es.arn

  providers = {
    aws = aws.us-west-1
  }
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_authorizer_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/cognito_authorizer_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_post_confirmation_lambda_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_post_confirmation_lambda_${element(var.log_group_environments, count.index)}_filter"
  log_group_name  = "/aws/lambda/cognito_post_confirmation_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_post_authentication_lambda_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_post_authentication_lambda_${element(var.log_group_environments, count.index)}_filter"
  log_group_name  = "/aws/lambda/cognito_post_authentication_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "clamav_fargate_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "clamav_fargate_${element(var.log_group_environments, count.index)}_filter"
  log_group_name  = "/aws/ecs/clamav_fargate_${element(var.log_group_environments, count.index)}"
}
