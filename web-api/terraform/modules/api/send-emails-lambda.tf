module "send_emails_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/sendEmails/send-emails.ts"
  handler_method = "handler"
  lambda_name    = "send_emails_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "30"
  memory_size    = "3008"
}


resource "aws_lambda_event_source_mapping" "send_emails_mapping" {
  event_source_arn = aws_sqs_queue.send_emails_queue.arn
  function_name    = module.send_emails_lambda.arn
  batch_size       = 1
}
