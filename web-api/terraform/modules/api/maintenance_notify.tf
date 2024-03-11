

module "maintenance_notify_lambda" {
  source         = "./lambda"
  handler        = "./web-api/terraform/template/lambdas/maintenance-notify.ts"
  handler_method = "handler"
  lambda_name    = "send_maintenance_notifications_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}
