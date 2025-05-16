

module "pdf_generation_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/pdfGeneration/pdf-generation.ts"
  handler_method = "handler"
  lambda_name    = "pdf_generator_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "6508"
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  alarm_name          = "pdf_generator_${var.environment}_${var.current_color}_errors"
  alarm_description   = "Alarm for Lambda function errors in PDF generation"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.pdf_generation_lambda.function_name
  }

  alarm_actions = [var.alert_sns_topic_arn]
}

module "pdf_load_test_investigation_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/pdfGeneration/pdf-generation-open-close.ts"
  handler_method = "openAndCloseAlot"
  lambda_name    = "open_close_a_lot_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "6508"
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}
