locals {
  timeout_time = "90"
}

module "change_of_address_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/pdfGeneration/pdf-generation.ts"
  handler_method = "changeOfAddressHandler"
  lambda_name    = "change_of_address_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}


resource "aws_lambda_event_source_mapping" "change_of_address_mapping" {
  event_source_arn = aws_sqs_queue.change_of_address_queue.arn
  function_name    = module.change_of_address_lambda.arn
  batch_size       = 1

  scaling_config {
    maximum_concurrency = 5
  }

}

resource "aws_sqs_queue" "change_of_address_queue" {
  name                       = "change_of_address_queue_${var.environment}_${var.current_color}"
  visibility_timeout_seconds = local.timeout_time

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.change_of_address_dl_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "change_of_address_dl_queue" {
  name = "change_of_address_dl_queue_${var.environment}_${var.current_color}"
}


