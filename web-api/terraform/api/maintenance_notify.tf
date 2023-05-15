resource "aws_lambda_function" "maintenance_notify_lambda" {
  count            = var.create_maintenance_notify
  depends_on       = [var.maintenance_notify_object]
  function_name    = "send_maintenance_notifications_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "maintenance-notify.handler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "maintenance_notify_${var.current_color}.js.zip"
  source_code_hash = var.maintenance_notify_object_hash
  timeout          = "29"
  memory_size      = "3008"

  runtime = var.node_version

  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }

}
