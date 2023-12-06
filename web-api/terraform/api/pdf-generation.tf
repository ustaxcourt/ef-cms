resource "aws_lambda_function" "pdf_generation_lambda" {
  depends_on       = [var.pdf_generation_object]
  function_name    = "pdf_generator_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "pdf-generation.handler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "pdf_generation_${var.current_color}.js.zip"
  source_code_hash = var.pdf_generation_object_hash
  timeout          = "29"
  memory_size      = "3008"

  # this one ALWAYS needs the puppeteer layer 
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = var.node_version

  environment {
    variables = var.lambda_environment
  }
}

