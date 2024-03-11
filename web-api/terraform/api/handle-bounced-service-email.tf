
module "zip_handle_bounce" {
  source         = "./lambda"
  handler        = "./web-api/terraform/template/lambdas/handle-bounce-notificatios.ts"
  handler_method = "handler"
  lambda_name    = "bounce_handler_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "60"
  memory_size    = "768"
}


resource "aws_lambda_permission" "allow_sns" {
  count         = var.create_bounce_handler
  action        = "lambda:InvokeFunction"
  function_name = module.zip_handle_bounce.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${var.account_id}:bounced_service_emails_${var.environment}"
}
