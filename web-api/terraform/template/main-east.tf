resource "aws_s3_bucket" "api_lambdas_bucket_east" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.lambdas"
  acl    = "private"

  tags = {
    environment = var.environment
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_object" "amended-petition-form-bucket-object-east" {
  bucket = aws_s3_bucket.documents_us_east_1.id
  key    = "amended-petition-form.pdf"
  source = "${path.module}/lambdas/dist/amended-petition-form.pdf"
}

data "archive_file" "zip_api" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/api.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api-public.js",
    "websockets.js",
    "trial-session.js",
    "send-emails.js",
    "websockets.js",
    "maintenance-notify.js",
    "cron.js",
    "streams.js",
    "cognito-triggers.js",
    "cognito-authorizer.js",
    "public-api-authorizer.js",
    "handle-bounced-service-email.js",
    "seal-in-lower-environment.js",
    "pdf-generation.js",
    "report.html"
  ]
}

data "archive_file" "zip_send_emails" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/send_emails.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api-public.js",
    "api.js",
    "trial-session.js",
    "websockets.js",
    "maintenance-notify.js",
    "cron.js",
    "streams.js",
    "cognito-triggers.js",
    "cognito-authorizer.js",
    "public-api-authorizer.js",
    "handle-bounced-service-email.js",
    "seal-in-lower-environment.js",
    "pdf-generation.js",
    "report.html"
  ]
}

data "archive_file" "zip_trial_session" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/trial_session.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api-public.js",
    "api.js",
    "websockets.js",
    "send-emails.js",
    "maintenance-notify.js",
    "cron.js",
    "streams.js",
    "cognito-triggers.js",
    "cognito-authorizer.js",
    "public-api-authorizer.js",
    "handle-bounced-service-email.js",
    "seal-in-lower-environment.js",
    "pdf-generation.js",
    "report.html"
  ]
}

data "archive_file" "zip_triggers" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/cognito-triggers.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api.js",
    "api-public.js",
    "websockets.js",
    "maintenance-notify.js",
    "trial-session.js",
    "send-emails.js",
    "seal-in-lower-environment.js",
    "cron.js",
    "streams.js",
    "cognito-authorizer.js",
    "public-api-authorizer.js",
    "handle-bounced-service-email.js",
    "pdf-generation.js",
    "report.html"
  ]
}


data "archive_file" "pdf_generation" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/pdf-generation.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
  excludes = [
    "api.js",
    "api-public.js",
    "websockets.js",
    "maintenance-notify.js",
    "trial-session.js",
    "send-emails.js",
    "seal-in-lower-environment.js",
    "cron.js",
    "streams.js",
    "cognito-authorizer.js",
    "public-api-authorizer.js",
    "handle-bounced-service-email.js",
    "report.html"
  ]
}

resource "null_resource" "pdf_generation_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.pdf_generation.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/pdf_generation_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
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

resource "null_resource" "triggers_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_triggers.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/triggers_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "worker_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_worker.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/worker_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "send_emails_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_send_emails.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/send_emails_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "trial_session_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_trial_session.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/trial_session_${var.deploying_color}.js.zip"
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

data "archive_file" "zip_maintenance_notify" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/maintenance-notify.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/maintenance-notify.js"
}

resource "null_resource" "maintenance_notify_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_maintenance_notify.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/maintenance_notify_${var.deploying_color}.js.zip"
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

data "archive_file" "zip_seal_in_lower" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/seal-in-lower-environment.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/seal-in-lower-environment.js"
}

resource "null_resource" "seal_in_lower_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_seal_in_lower.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/seal_in_lower_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}

data "archive_file" "zip_bounce_handler" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/handle-bounced-service-email.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/handle-bounced-service-email.js"
}

resource "null_resource" "bounce_handler_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_bounce_handler.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/bounce_handler_${var.deploying_color}.js.zip"
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

resource "aws_route53_record" "route53_record_east" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert_east.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name            = each.value.name
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "wildcard_dns_validation_east" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_east.arn
  validation_record_fqdns = [for record in aws_route53_record.route53_record_east : record.fqdn]
  provider                = aws.us-east-1
}


data "aws_s3_bucket_object" "pdf_generation_blue_east_object" {
  depends_on = [null_resource.pdf_generation_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "pdf_generation_blue.js.zip"
}

data "aws_s3_bucket_object" "pdf_generation_green_east_object" {
  depends_on = [null_resource.pdf_generation_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "pdf_generation_green.js.zip"
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

data "aws_s3_bucket_object" "maintenance_notify_blue_east_object" {
  depends_on = [null_resource.maintenance_notify_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "maintenance_notify_blue.js.zip"
}

data "aws_s3_bucket_object" "maintenance_notify_green_east_object" {
  depends_on = [null_resource.maintenance_notify_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "maintenance_notify_green.js.zip"
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

data "aws_s3_bucket_object" "seal_in_lower_blue_east_object" {
  depends_on = [null_resource.seal_in_lower_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "seal_in_lower_blue.js.zip"
}

data "aws_s3_bucket_object" "seal_in_lower_green_east_object" {
  depends_on = [null_resource.seal_in_lower_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "seal_in_lower_green.js.zip"
}

data "aws_s3_bucket_object" "triggers_green_east_object" {
  depends_on = [null_resource.triggers_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "triggers_green.js.zip"
}

data "aws_s3_object" "worker_green_east_object" { # 10007 we left here
  depends_on = [null_resource.worker_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "worker_green.js.zip"
}

data "aws_s3_object" "worker_blue_east_object" {
  depends_on = [null_resource.worker_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "worker_blue.js.zip"
}

data "aws_s3_bucket_object" "send_emails_green_east_object" {
  depends_on = [null_resource.send_emails_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "send_emails_green.js.zip"
}

data "aws_s3_bucket_object" "send_emails_blue_east_object" {
  depends_on = [null_resource.send_emails_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "send_emails_blue.js.zip"
}

data "aws_s3_bucket_object" "trial_session_blue_east_object" {
  depends_on = [null_resource.trial_session_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "trial_session_blue.js.zip"
}

data "aws_s3_bucket_object" "trial_session_green_east_object" {
  depends_on = [null_resource.trial_session_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "trial_session_green.js.zip"
}


data "aws_s3_bucket_object" "triggers_blue_east_object" {
  depends_on = [null_resource.triggers_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "triggers_blue.js.zip"
}

data "aws_s3_bucket_object" "bounce_handler_blue_east_object" {
  depends_on = [null_resource.bounce_handler_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "bounce_handler_blue.js.zip"
}

data "aws_s3_bucket_object" "bounce_handler_green_east_object" {
  depends_on = [null_resource.bounce_handler_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "bounce_handler_green.js.zip"
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
    evaluate_target_health = true
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
    evaluate_target_health = true
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
  api_object                = null_resource.api_east_object
  api_public_object         = null_resource.api_public_east_object
  websockets_object         = null_resource.websockets_east_object
  send_emails_object        = null_resource.send_emails_east_object
  trial_session_object      = null_resource.trial_session_east_object
  maintenance_notify_object = null_resource.maintenance_notify_east_object
  pdf_generation_object     = null_resource.pdf_generation_east_object
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  cron_object               = null_resource.cron_east_object
  streams_object            = null_resource.streams_east_object
  node_version              = var.green_node_version
  create_maintenance_notify = 1
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  websocket_authorizer_uri  = aws_lambda_function.websocket_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  pool_arn                  = aws_cognito_user_pool.pool.arn
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "green"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws           = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "green"
  deploying_color                = var.deploying_color
  deployment_timestamp           = var.deployment_timestamp
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  public_object_hash             = data.aws_s3_bucket_object.api_public_green_east_object.etag
  api_object_hash                = data.aws_s3_bucket_object.api_green_east_object.etag
  pdf_generation_object_hash     = data.aws_s3_bucket_object.pdf_generation_green_east_object.etag
  send_emails_object_hash        = data.aws_s3_bucket_object.send_emails_green_east_object.etag
  trial_session_object_hash      = data.aws_s3_bucket_object.trial_session_green_east_object.etag
  websockets_object_hash         = data.aws_s3_bucket_object.websockets_green_east_object.etag
  maintenance_notify_object_hash = data.aws_s3_bucket_object.maintenance_notify_green_east_object.etag
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_green_east_object.etag
  cron_object_hash               = data.aws_s3_bucket_object.cron_green_east_object.etag
  streams_object_hash            = data.aws_s3_bucket_object.streams_green_east_object.etag
  use_layers                     = var.green_use_layers
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  triggers_object                = null_resource.triggers_east_object
  triggers_object_hash           = data.aws_s3_bucket_object.triggers_green_east_object.etag
  worker_object                  = null_resource.worker_east_object
  worker_object_hash             = data.aws_s3_bucket_object.worker_green_east_object.etag
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  seal_in_lower_object      = null_resource.seal_in_lower_east_object
  seal_in_lower_object_hash = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? data.aws_s3_bucket_object.seal_in_lower_green_east_object.etag : ""
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  lower_env_account_id      = var.lower_env_account_id
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  bounce_handler_object      = null_resource.bounce_handler_east_object
  bounce_handler_object_hash = data.aws_s3_bucket_object.bounce_handler_green_east_object.etag
  create_bounce_handler      = 1
}

module "api-east-blue" {
  api_object                = null_resource.api_east_object
  api_public_object         = null_resource.api_public_east_object
  send_emails_object        = null_resource.send_emails_east_object
  trial_session_object      = null_resource.trial_session_east_object
  pdf_generation_object     = null_resource.pdf_generation_east_object
  websockets_object         = null_resource.websockets_east_object
  maintenance_notify_object = null_resource.maintenance_notify_east_object
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  create_maintenance_notify = 1
  cron_object               = null_resource.cron_east_object
  streams_object            = null_resource.streams_east_object
  pool_arn                  = aws_cognito_user_pool.pool.arn
  node_version              = var.blue_node_version
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  websocket_authorizer_uri  = aws_lambda_function.websocket_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "blue"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.blue_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws           = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "blue"
  deploying_color                = var.deploying_color
  deployment_timestamp           = var.deployment_timestamp
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  public_object_hash             = data.aws_s3_bucket_object.api_public_blue_east_object.etag
  api_object_hash                = data.aws_s3_bucket_object.api_blue_east_object.etag
  send_emails_object_hash        = data.aws_s3_bucket_object.send_emails_blue_east_object.etag
  trial_session_object_hash      = data.aws_s3_bucket_object.trial_session_blue_east_object.etag
  websockets_object_hash         = data.aws_s3_bucket_object.websockets_blue_east_object.etag
  maintenance_notify_object_hash = data.aws_s3_bucket_object.maintenance_notify_blue_east_object.etag
  puppeteer_object_hash          = data.aws_s3_bucket_object.puppeteer_blue_east_object.etag
  pdf_generation_object_hash     = data.aws_s3_bucket_object.pdf_generation_blue_east_object.etag
  cron_object_hash               = data.aws_s3_bucket_object.cron_blue_east_object.etag
  streams_object_hash            = data.aws_s3_bucket_object.streams_blue_east_object.etag
  use_layers                     = var.blue_use_layers
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.blue_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  triggers_object                = null_resource.triggers_east_object
  triggers_object_hash           = data.aws_s3_bucket_object.triggers_green_east_object.etag
  worker_object                  = null_resource.worker_east_object
  worker_object_hash             = data.aws_s3_bucket_object.worker_blue_east_object.etag
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  seal_in_lower_object      = null_resource.seal_in_lower_east_object
  seal_in_lower_object_hash = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? data.aws_s3_bucket_object.seal_in_lower_blue_east_object.etag : ""
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  lower_env_account_id      = var.lower_env_account_id
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  bounce_handler_object      = null_resource.bounce_handler_east_object
  bounce_handler_object_hash = data.aws_s3_bucket_object.bounce_handler_blue_east_object.etag
  create_bounce_handler      = 1
}
