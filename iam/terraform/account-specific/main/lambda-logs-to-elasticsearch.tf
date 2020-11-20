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
  runtime       = "nodejs10.x"

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

resource "aws_cloudwatch_log_subscription_filter" "api_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "api_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "api_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "streams_filter_blue" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "streams_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/streams_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "streams_filter_green" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "streams_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/streams_${element(var.log_group_environments, count.index)}_green"
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_authorizer_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/cognito_authorizer_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "migration_lambda_filter" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "migration_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/migration_segments_lambda_${element(var.log_group_environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "api_stage_logs_blue" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "api_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_${element(var.log_group_environments, count.index)}_blue"
}

resource "aws_cloudwatch_log_subscription_filter" "api_stage_logs_green" {
  count           = length(var.log_group_environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern  = ""
  name            = "api_stage_logs_lambda_filter"
  log_group_name  = "/aws/apigateway/gateway_api_${element(var.log_group_environments, count.index)}_green"
}
