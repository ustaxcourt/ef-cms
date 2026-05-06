module "read_only_notify_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cases/sendReadOnlyNotificationsLambda.ts"
  handler_method = "sendReadOnlyNotificationsLambda"
  lambda_name    = "send_read_only_notifications_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}
