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
  timeout = "29"
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
}