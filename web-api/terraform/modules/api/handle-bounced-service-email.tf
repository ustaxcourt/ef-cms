
module "zip_handle_bounce" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/email/handleBounceNotificationsLambda.ts"
  handler_method = "handleBounceNotificationsLambda"
  lambda_name    = "bounce_handler_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "60"
}


resource "aws_lambda_permission" "allow_sns" {
  count         = var.create_bounce_handler
  action        = "lambda:InvokeFunction"
  function_name = module.zip_handle_bounce.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${data.aws_caller_identity.current.account_id}:bounced_service_emails_${var.environment}"

  lifecycle {
    replace_triggered_by = [
      module.zip_handle_bounce.lambda_function
    ]
  }
}
