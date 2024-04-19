

module "pdf_generation_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/pdfGeneration/pdf-generation.ts"
  handler_method = "handler"
  lambda_name    = "pdf_generator_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}
