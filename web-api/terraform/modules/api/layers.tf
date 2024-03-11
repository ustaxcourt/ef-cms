resource "aws_lambda_layer_version" "puppeteer_layer" {
  depends_on          = [var.puppeteer_layer_object]
  s3_bucket           = var.lambda_bucket_id
  s3_key              = "${var.current_color}_puppeteer_lambda_layer.zip"
  layer_name          = "puppeteer-${var.environment}-${var.current_color}"
  source_code_hash    = var.puppeteer_object_hash
  compatible_runtimes = [var.node_version]
}
