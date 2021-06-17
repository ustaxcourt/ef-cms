resource "aws_lambda_function" "zip_streams" {
  count            = var.create_streams
  depends_on       = [var.streams_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "streams_${var.current_color}.js.zip"
  source_code_hash = var.streams_object_hash
  function_name    = "streams_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "streams.handler"
  timeout          = "60"
  memory_size      = "768"

  runtime = "nodejs14.x"


  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  count                          = var.create_streams
  event_source_arn               = var.stream_arn
  function_name                  = aws_lambda_function.zip_streams[0].arn
  starting_position              = "LATEST"
  bisect_batch_on_function_error = "true"
  batch_size                     = "100"
}
