resource "aws_lambda_layer_version" "puppeteer_layer" {
  filename   = "../../runtimes/puppeteer/puppeteer_lambda_layer.tar.gz"
  layer_name = "puppeteer-${var.environment}"

  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_lambda_layer_version" "clamav_layer" {
  filename   = "../../runtimes/clamav/clamav_lambda_layer.tar.gz"
  layer_name = "clamav-${var.environment}"

  compatible_runtimes = ["nodejs12.x"]
}