resource "null_resource" "puppeteer_layer" {
  depends_on = [var.lambda_bucket_id]
  provisioner "local-exec" {
    command = "aws s3 cp ../../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${var.lambda_bucket_id}/${var.current_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "aws_s3_object" "puppeteer_object" {
  depends_on = [null_resource.puppeteer_layer]
  bucket     = var.lambda_bucket_id
  key        = "${var.current_color}_puppeteer_lambda_layer.zip"
}

resource "aws_lambda_layer_version" "puppeteer_layer" {
  s3_bucket           = var.lambda_bucket_id
  s3_key              = "${var.current_color}_puppeteer_lambda_layer.zip"
  layer_name          = "puppeteer-${var.environment}-${var.current_color}"
  source_code_hash    = data.aws_s3_bucket_object.puppeteer_object.etag
  compatible_runtimes = [var.node_version]
}


