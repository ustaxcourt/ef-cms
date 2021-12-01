resource "aws_s3_bucket" "api_lambdas_bucket_west" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.lambdas"
  acl    = "private"

  provider = aws.us-west-1
  tags = {
    environment = var.environment
  }
}


resource "null_resource" "api_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/api_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "maintenance_notify_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_maintenance_notify.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/maintenance_notify_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "websockets_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_websockets.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/websockets_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "api_public_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api_public.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/api_public_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "puppeteer_layer_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "cron_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_cron.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/cron_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "aws_acm_certificate" "api_gateway_cert_west" {
  domain_name       = "*.${var.dns_domain}"
  validation_method = "DNS"
  provider          = aws.us-west-1

  tags = {
    Name          = "wildcard.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for wildcard.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

data "aws_s3_bucket_object" "api_public_blue_west_object" {
  depends_on = [null_resource.api_public_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "api_public_blue.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "api_public_green_west_object" {
  depends_on = [null_resource.api_public_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "api_public_green.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "api_blue_west_object" {
  depends_on = [null_resource.api_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "api_blue.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "api_green_west_object" {
  depends_on = [null_resource.api_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "api_green.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "websockets_blue_west_object" {
  depends_on = [null_resource.websockets_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "websockets_blue.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "websockets_green_west_object" {
  depends_on = [null_resource.websockets_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "websockets_green.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "maintenance_notify_blue_west_object" {
  depends_on = [null_resource.maintenance_notify_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "maintenance_notify_blue.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "maintenance_notify_green_west_object" {
  depends_on = [null_resource.maintenance_notify_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "maintenance_notify_green.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "puppeteer_blue_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "blue_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "puppeteer_green_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "green_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}

data "aws_elasticsearch_domain" "green_west_elasticsearch_domain" {
  depends_on = [
    module.elasticsearch_alpha,
    module.elasticsearch_beta,
  ]
  domain_name = var.green_elasticsearch_domain
}

data "aws_elasticsearch_domain" "blue_west_elasticsearch_domain" {
  depends_on = [
    module.elasticsearch_alpha,
    module.elasticsearch_beta,
  ]
  domain_name = var.blue_elasticsearch_domain
}

resource "aws_api_gateway_domain_name" "public_api_custom_main_west" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_west]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_west.arn
  domain_name              = "public-api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  provider                 = aws.us-west-1
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_domain_name" "api_custom_main_west" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_west]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_west.arn
  domain_name              = "api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  provider                 = aws.us-west-1
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_route53_record" "api_route53_main_west_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom_main_west.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "api_main_us_west_1"
  provider       = aws.us-west-1

  alias {
    name                   = aws_api_gateway_domain_name.api_custom_main_west.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom_main_west.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = "us-west-1"
  }
}


resource "aws_route53_record" "public_api_route53_main_west_regional_record" {
  name           = aws_api_gateway_domain_name.public_api_custom_main_west.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "public_api_main_us_west_1"
  provider       = aws.us-west-1

  alias {
    name                   = aws_api_gateway_domain_name.public_api_custom_main_west.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.public_api_custom_main_west.regional_zone_id
    evaluate_target_health = false
  }

  latency_routing_policy {
    region = "us-west-1"
  }
}

module "api-west-waf" {
  environment = var.environment
  providers = {
    aws = aws.us-west-1
  }
  source = "./waf/"
}

module "api-west-green" {
  api_object                = null_resource.api_west_object
  api_public_object         = null_resource.api_public_west_object
  websockets_object         = null_resource.websockets_west_object
  puppeteer_layer_object    = null_resource.puppeteer_layer_west_object
  cron_object               = ""
  maintenance_notify_object = null_resource.maintenance_notify_west_object
  streams_object            = ""
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT      = "dynamodb.us-west-1.amazonaws.com"
    CURRENT_COLOR          = "green"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = data.aws_elasticsearch_domain.green_west_elasticsearch_domain.endpoint
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
  }
  current_color                  = "green"
  deploying_color                = var.deploying_color
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_west.id
  public_object_hash             = data.aws_s3_bucket_object.api_public_green_west_object.etag
  api_object_hash                = data.aws_s3_bucket_object.api_green_west_object.etag
  websockets_object_hash         = data.aws_s3_bucket_object.websockets_green_west_object.etag
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_green_west_object.etag
  cron_object_hash               = ""
  maintenance_notify_object_hash = data.aws_s3_bucket_object.maintenance_notify_green_west_object.etag
  streams_object_hash            = ""
  pool_arn                       = aws_cognito_user_pool.pool.arn
  create_cron                    = 0
  create_streams                 = 0
  create_maintenance_notify      = 1
  stream_arn                     = ""
  web_acl_arn                    = module.api-west-waf.web_acl_arn
  triggers_object                = ""
  triggers_object_hash           = ""
  create_triggers                = 0

  # lambda to seal cases in lower environment (only deployed to lower environments)
  seal_in_lower_object           = ""
  seal_in_lower_object_hash      = ""
  create_seal_in_lower           = 0
  lower_env_account_id           = var.lower_env_account_id
  prod_env_account_id            = var.prod_env_account_id
}

module "api-west-blue" {
  api_object                = null_resource.api_west_object
  api_public_object         = null_resource.api_public_west_object
  websockets_object         = null_resource.websockets_west_object
  puppeteer_layer_object    = null_resource.puppeteer_layer_west_object
  cron_object               = ""
  maintenance_notify_object = null_resource.maintenance_notify_west_object
  streams_object            = ""
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT      = "dynamodb.us-west-1.amazonaws.com"
    CURRENT_COLOR          = "blue"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = data.aws_elasticsearch_domain.blue_west_elasticsearch_domain.endpoint
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
  }
  current_color                  = "blue"
  deploying_color                = var.deploying_color
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_west.id
  public_object_hash             = data.aws_s3_bucket_object.api_public_blue_west_object.etag
  api_object_hash                = data.aws_s3_bucket_object.api_blue_west_object.etag
  websockets_object_hash         = data.aws_s3_bucket_object.websockets_blue_west_object.etag
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_blue_west_object.etag
  cron_object_hash               = ""
  maintenance_notify_object_hash = data.aws_s3_bucket_object.maintenance_notify_blue_west_object.etag
  streams_object_hash            = ""
  create_cron                    = 0
  create_streams                 = 0
  pool_arn                       = aws_cognito_user_pool.pool.arn
  create_maintenance_notify      = 1
  stream_arn                     = ""
  web_acl_arn                    = module.api-west-waf.web_acl_arn
  triggers_object                = ""
  triggers_object_hash           = ""
  create_triggers                = 0

  # lambda to seal cases in lower environment (only deployed to lower environments)
  seal_in_lower_object           = ""
  seal_in_lower_object_hash      = ""
  create_seal_in_lower           = 0
  lower_env_account_id           = var.lower_env_account_id
  prod_env_account_id            = var.prod_env_account_id
}
