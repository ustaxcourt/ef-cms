resource "aws_s3_bucket" "api_lambdas_bucket_east" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.lambdas"
  acl    = "private"
  region = "us-east-1"

  tags = {
    environment = var.environment
  }
}

resource "aws_s3_bucket" "api_lambdas_bucket_west" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.lambdas"
  acl    = "private"
  region = "us-west-1"

  provider = aws.us-west-1
  tags = {
    environment = var.environment
  }
}

data "archive_file" "zip_api" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/api.js.zip"
  source_file = "${path.module}/../template/lambdas/dist/api.js"
}

resource "null_resource" "api_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/api_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

resource "null_resource" "api_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/api_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
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
    always_run = "${timestamp()}"
  }
}

resource "null_resource" "websockets_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_websockets.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/websockets_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
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
    always_run = "${timestamp()}"
  }
}

resource "null_resource" "api_public_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_api_public.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/api_public_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

resource "null_resource" "puppeteer_layer_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

resource "null_resource" "puppeteer_layer_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

module "api-east-green" {
  api_object             = null_resource.api_east_object
  api_public_object      = null_resource.api_public_east_object
  websockets_object      = null_resource.websockets_east_object
  puppeteer_layer_object = null_resource.puppeteer_layer_east_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
  }
  current_color    = "green"
  deploying_color  = var.deploying_color
  lambda_bucket_id = aws_s3_bucket.api_lambdas_bucket_east.id
}

module "api-east-blue" {
  api_object             = null_resource.api_east_object
  api_public_object      = null_resource.api_public_east_object
  websockets_object      = null_resource.websockets_east_object
  puppeteer_layer_object = null_resource.puppeteer_layer_east_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
  }
  current_color    = "blue"
  deploying_color  = var.deploying_color
  lambda_bucket_id = aws_s3_bucket.api_lambdas_bucket_east.id
}

module "api-west-green" {
  api_object             = null_resource.api_west_object
  api_public_object      = null_resource.api_public_west_object
  websockets_object      = null_resource.websockets_west_object
  puppeteer_layer_object = null_resource.puppeteer_layer_west_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-west-1.amazonaws.com"
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
  }
  current_color    = "green"
  deploying_color  = var.deploying_color
  lambda_bucket_id = aws_s3_bucket.api_lambdas_bucket_west.id
}

module "api-west-blue" {
  api_object             = null_resource.api_west_object
  api_public_object      = null_resource.api_public_west_object
  websockets_object      = null_resource.websockets_west_object
  puppeteer_layer_object = null_resource.puppeteer_layer_west_object
  source                 = "../api/"
  environment            = var.environment
  dns_domain             = var.dns_domain
  authorizer_uri         = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id             = data.aws_caller_identity.current.account_id
  zone_id                = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-west-1.amazonaws.com"
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
  }
  current_color    = "blue"
  deploying_color  = var.deploying_color
  lambda_bucket_id = aws_s3_bucket.api_lambdas_bucket_west.id
}
