module "rotate_info_indices" {
  count          = var.es_logs_instance_count > 0 ? 1 : 0
  source         = "../../../../web-api/terraform/modules/lambda"
  handler_file   = "./aws/lambdas/RotateInfoIndices/src/index.js"
  handler_method = "handler"
  lambda_name    = "RotateInfoIndices"
  role           = aws_iam_role.lambda_elasticsearch_execution_role[0].arn
  environment = {
    es_endpoint = aws_opensearch_domain.efcms-logs[0].endpoint
    expiration  = var.number_of_days_to_keep_info_logs
  }
  timeout = "60"
}

resource "aws_cloudwatch_log_group" "rotate_info_indices" {
  count             = var.es_logs_instance_count > 0 ? 1 : 0
  name              = "/aws/lambda/${module.rotate_info_indices[0].function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_event_rule" "every_day" {
  count               = var.es_logs_instance_count > 0 ? 1 : 0
  name                = "daily-job"
  description         = "Fires every day"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "rotate_info_indices_daily" {
  count     = var.es_logs_instance_count > 0 ? 1 : 0
  rule      = aws_cloudwatch_event_rule.every_day[0].name
  target_id = "lambda"
  arn       = module.rotate_info_indices[0].arn
}

resource "terraform_data" "rotate_info_indices_last_modified" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  input = module.rotate_info_indices[0].last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch_to_rotate_info_indices_daily" {
  count         = var.es_logs_instance_count > 0 ? 1 : 0
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.rotate_info_indices[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_day[0].arn
  lifecycle {
    replace_triggered_by = [
      terraform_data.rotate_info_indices_last_modified[0]
    ]
  }
}
