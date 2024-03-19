module "rotate_info_indices" {
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./aws/lambdas/RotateInfoIndices/src/index.js"
  handler_method = "handler"
  lambda_name    = "RotateInfoIndices"
  role           = aws_iam_role.lambda_elasticsearch_execution_role.arn
  environment = {
    es_endpoint = aws_opensearch_domain.efcms-logs.endpoint
    expiration  = var.number_of_days_to_keep_info_logs
  }
  timeout = "60"
}

resource "aws_cloudwatch_log_group" "rotate_info_indices" {
  name              = "/aws/lambda/${module.rotate_info_indices.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_event_rule" "every_day" {
  name                = "daily-job"
  description         = "Fires every day"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "rotate_info_indices_daily" {
  rule      = aws_cloudwatch_event_rule.every_day.name
  target_id = "lambda"
  arn       = module.rotate_info_indices.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_rotate_info_indices_daily" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.rotate_info_indices.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_day.arn
}
