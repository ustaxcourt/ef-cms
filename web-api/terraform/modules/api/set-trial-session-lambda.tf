
module "set_trial_session_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/trial-session/trial-session.ts"
  handler_method = "handler"
  lambda_name    = "set_trial_session_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "30"
  memory_size    = "3008"
}

resource "aws_lambda_event_source_mapping" "calendar_trial_session_mapping" {
  event_source_arn = aws_sqs_queue.calendar_trial_session_queue.arn
  function_name    = module.set_trial_session_lambda.arn
  batch_size       = 1
}
