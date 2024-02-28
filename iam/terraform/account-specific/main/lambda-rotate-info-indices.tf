data "archive_file" "zip_rotate_info_indices_lambda" {
  type        = "zip"
  output_path = "${path.cwd}/../../../../aws/lambdas/RotateInfoIndices.zip"
  source_dir = "${path.cwd}/../../../../aws/lambdas/RotateInfoIndices/dist/"
}

resource "aws_lambda_function" "rotate_info_indices" {
  filename         = data.archive_file.zip_rotate_info_indices_lambda.output_path
  function_name    = "RotateInfoIndices"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_elasticsearch_execution_role.arn
  runtime          = "nodejs18.x"
  source_code_hash = "${filebase64sha256(data.archive_file.zip_rotate_info_indices_lambda.output_path)}-${aws_iam_role.lambda_elasticsearch_execution_role.name}"
  timeout          = 60

  environment {
    variables = {
      es_endpoint = aws_opensearch_domain.efcms-logs.endpoint
      expiration = var.number_of_days_to_keep_info_logs
    }
  }
}

resource "aws_cloudwatch_log_group" "rotate_info_indices" {
  name              = "/aws/lambda/${aws_lambda_function.rotate_info_indices.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_event_rule" "every_day" {
  name                = "daily-job"
  description         = "Fires every day"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "rotate_info_indices_daily" {
  rule      = "${aws_cloudwatch_event_rule.every_day.name}"
  target_id = "lambda"
  arn       = "${aws_lambda_function.rotate_info_indices.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_rotate_info_indices_daily" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.rotate_info_indices.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.every_day.arn}"
}
