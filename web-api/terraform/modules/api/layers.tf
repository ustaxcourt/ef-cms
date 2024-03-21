resource "aws_s3_object" "puppeteer_object" {
  bucket = var.lambda_bucket_id
  key    = "${var.current_color}_puppeteer_lambda_layer.zip"
  source = "../../../runtimes/puppeteer/puppeteer_lambda_layer.zip"
  source_hash = filemd5("../../../runtimes/puppeteer/puppeteer_lambda_layer.zip")
}

resource "aws_lambda_layer_version" "puppeteer_layer" {
  s3_bucket           = var.lambda_bucket_id
  s3_key              = "${var.current_color}_puppeteer_lambda_layer.zip"
  layer_name          = "puppeteer-${var.environment}-${var.current_color}"
  source_code_hash    = aws_s3_object.puppeteer_object.source_hash
  compatible_runtimes = ["nodejs18.x"]
}


