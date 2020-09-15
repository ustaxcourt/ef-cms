data "archive_file" "zip_streams" {
  type        = "zip"
  output_path = "${path.module}/lambdas/streams.js.zip"
  source_file = "${path.module}/lambdas/dist/streams.js"
}

resource "aws_lambda_function" "zip_streams" {
  filename      = data.archive_file.zip_streams.output_path
  function_name = "streams_${var.environment}"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  handler       = "streams.handler"
  source_code_hash = data.archive_file.zip_streams.output_base64sha256
  timeout = "900"
  memory_size = "3008"

  runtime = "nodejs12.x"


  environment {
    variables = data.null_data_source.locals.outputs
  }
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn  = aws_dynamodb_table.efcms-east.stream_arn
  function_name     = aws_lambda_function.zip_streams.arn
  starting_position = "TRIM_HORIZON"

  # The below config was added due to a potential Terraform bug
  # see https://github.com/terraform-providers/terraform-provider-aws/issues/14522
  maximum_batching_window_in_seconds = 0
  maximum_record_age_in_seconds      = 604800
  maximum_retry_attempts             = 10000
}
