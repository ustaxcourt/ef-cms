module "zip_streams" {
  source         = "../lambda"
  handler        = "./web-api/src/lambdas/streams/processStreamRecordsLambda.ts"
  handler_method = "processStreamRecordsLambda"
  lambda_name    = "streams_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "60"
  memory_size    = "768"
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  count                          = var.create_streams
  event_source_arn               = var.stream_arn
  function_name                  = module.zip_streams.function_name
  starting_position              = "TRIM_HORIZON"
  bisect_batch_on_function_error = "true"
  batch_size                     = "100"
}
