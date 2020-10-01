resource "aws_lambda_function" "logs_to_es" {
  filename = "../../../../aws/lambdas/LogsToElasticSearch_info.zip"
  function_name = "LogsToElasticSearch_info"
  handler = "index.handler"
  role = aws_iam_role.lambda_elasticsearch_execution_role.arn
  runtime = "nodejs10.x"

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

resource "aws_cloudwatch_log_subscription_filter" "api_filter" {
  count = length(var.environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern = ""
  name = "api_${count.index}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.environments, count.index)}"
}
