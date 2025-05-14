

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
