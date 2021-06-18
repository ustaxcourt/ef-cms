resource "aws_s3_bucket" "api_lambdas_bucket_east" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.lambdas"
  acl    = "private"

  tags = {
    environment = var.environment
  }
}

data "archive_file" "zip_api" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/api.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = ["${path.module}/../template/lambdas/dist/api-public.js",
    "${path.module}/../template/lambdas/dist/websockets.js",
    "${path.module}/../template/lambdas/dist/cron.js",
    "${path.module}/../template/lambdas/dist/streams.js",
    "${path.module}/../template/lambdas/dist/cognito-triggers.js",
    "${path.module}/../template/lambdas/dist/cognito-authorizer.js",
  "${path.module}/../template/lambdas/dist/report.html", ]
}

resource "null_resource" "api_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/api_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "archive_file" "zip_websockets" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/websockets.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/websockets.js"
}

resource "null_resource" "websockets_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_websockets.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/websockets_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "archive_file" "zip_api_public" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/api-public.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/api-public.js"
}

resource "null_resource" "api_public_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api_public.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/api_public_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "puppeteer_layer_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "archive_file" "zip_cron" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/cron.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/cron.js"
}

resource "null_resource" "cron_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_cron.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/cron_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "archive_file" "zip_streams" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/streams.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/streams.js"
}

resource "null_resource" "streams_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_streams.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/streams_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "aws_acm_certificate" "api_gateway_cert_east" {
  domain_name       = "*.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "wildcard.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for wildcard.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

data "aws_s3_bucket_object" "api_public_blue_east_object" {
  depends_on = [null_resource.api_public_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "api_public_blue.js.zip"
}

data "aws_s3_bucket_object" "api_public_green_east_object" {
  depends_on = [null_resource.api_public_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "api_public_green.js.zip"
}

data "aws_s3_bucket_object" "api_blue_east_object" {
  depends_on = [null_resource.api_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "api_blue.js.zip"
}

data "aws_s3_bucket_object" "api_green_east_object" {
  depends_on = [null_resource.api_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "api_green.js.zip"
}

data "aws_s3_bucket_object" "websockets_blue_east_object" {
  depends_on = [null_resource.websockets_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "websockets_blue.js.zip"
}

data "aws_s3_bucket_object" "websockets_green_east_object" {
  depends_on = [null_resource.websockets_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "websockets_green.js.zip"
}

data "aws_s3_bucket_object" "puppeteer_blue_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "blue_puppeteer_lambda_layer.zip"
}

data "aws_s3_bucket_object" "puppeteer_green_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "green_puppeteer_lambda_layer.zip"
}

data "aws_s3_bucket_object" "cron_blue_east_object" {
  depends_on = [null_resource.cron_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "cron_blue.js.zip"
}

data "aws_s3_bucket_object" "cron_green_east_object" {
  depends_on = [null_resource.cron_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "cron_green.js.zip"
}

data "aws_s3_bucket_object" "streams_blue_east_object" {
  depends_on = [null_resource.streams_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "streams_blue.js.zip"
}

data "aws_s3_bucket_object" "streams_green_east_object" {
  depends_on = [null_resource.streams_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "streams_green.js.zip"
}

data "aws_elasticsearch_domain" "green_east_elasticsearch_domain" {
  depends_on = [
    module.elasticsearch_alpha,
    module.elasticsearch_beta,
  ]
  domain_name = var.green_elasticsearch_domain
}

data "aws_elasticsearch_domain" "blue_east_elasticsearch_domain" {
  depends_on = [
    module.elasticsearch_alpha,
    module.elasticsearch_beta,
  ]
  domain_name = var.blue_elasticsearch_domain
}

data "aws_dynamodb_table" "green_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.green_table_name
}

data "aws_dynamodb_table" "blue_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.blue_table_name
}

resource "aws_api_gateway_domain_name" "public_api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "public-api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_domain_name" "api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom_main_east.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "public_api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.public_api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "public_api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.public_api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.public_api_custom_main_east.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

module "api-east-waf" {
  environment = var.environment
  providers = {
    aws = aws.us-east-1
  }
  source = "./waf/"
}

module "api-east-green" {
  api_object             = null_resource.api_east_object
  api_public_object      = null_resource.api_public_east_object
  websockets_object      = null_resource.websockets_east_object
  puppeteer_layer_object = null_resource.puppeteer_layer_east_object
  cron_object            = null_resource.cron_east_object
  streams_object         = null_resource.streams_east_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    CURRENT_COLOR          = "green"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = data.aws_elasticsearch_domain.green_east_elasticsearch_domain.endpoint
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
  }
  current_color          = "green"
  deploying_color        = var.deploying_color
  lambda_bucket_id       = aws_s3_bucket.api_lambdas_bucket_east.id
  public_object_hash     = data.aws_s3_bucket_object.api_public_green_east_object.etag
  api_object_hash        = data.aws_s3_bucket_object.api_green_east_object.etag
  websockets_object_hash = data.aws_s3_bucket_object.websockets_green_east_object.etag
  puppeteer_object_hash  = data.aws_s3_bucket_object.puppeteer_green_east_object.etag
  cron_object_hash       = data.aws_s3_bucket_object.cron_green_east_object.etag
  streams_object_hash    = data.aws_s3_bucket_object.streams_green_east_object.etag
  create_cron            = 1
  create_streams         = 1
  stream_arn             = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn            = module.api-east-waf.web_acl_arn
}

module "api-east-blue" {
  api_object             = null_resource.api_east_object
  api_public_object      = null_resource.api_public_east_object
  websockets_object      = null_resource.websockets_east_object
  puppeteer_layer_object = null_resource.puppeteer_layer_east_object
  cron_object            = null_resource.cron_east_object
  streams_object         = null_resource.streams_east_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    CURRENT_COLOR          = "blue"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = data.aws_elasticsearch_domain.blue_east_elasticsearch_domain.endpoint
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
  }
  current_color          = "blue"
  deploying_color        = var.deploying_color
  lambda_bucket_id       = aws_s3_bucket.api_lambdas_bucket_east.id
  public_object_hash     = data.aws_s3_bucket_object.api_public_blue_east_object.etag
  api_object_hash        = data.aws_s3_bucket_object.api_blue_east_object.etag
  websockets_object_hash = data.aws_s3_bucket_object.websockets_blue_east_object.etag
  puppeteer_object_hash  = data.aws_s3_bucket_object.puppeteer_blue_east_object.etag
  cron_object_hash       = data.aws_s3_bucket_object.cron_blue_east_object.etag
  streams_object_hash    = data.aws_s3_bucket_object.streams_blue_east_object.etag
  create_cron            = 1
  create_streams         = 1
  stream_arn             = data.aws_dynamodb_table.blue_dynamo_table.stream_arn
  web_acl_arn            = module.api-east-waf.web_acl_arn
}
