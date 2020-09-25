resource "aws_s3_bucket" "layer_bucket" {
  bucket   = "${var.dns_domain}.efcms.${var.environment}.${var.region}.layers"
  acl      = "private"
  region   = var.region

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket_object" "puppeteer_layer_object" {
  bucket = aws_s3_bucket.layer_bucket.id
  key    = "${var.environment}_puppeteer_lambda_layer.zip"
  source = "../../runtimes/puppeteer/puppeteer_lambda_layer.zip"
  etag   = "${filemd5("../../runtimes/puppeteer/puppeteer_lambda_layer.zip")}"
}

resource "aws_lambda_layer_version" "puppeteer_layer" {
  s3_bucket  = aws_s3_bucket.layer_bucket.id
  s3_key     = aws_s3_bucket_object.puppeteer_layer_object.key
  layer_name = "puppeteer-${var.environment}"

  compatible_runtimes = ["nodejs12.x"]
}
