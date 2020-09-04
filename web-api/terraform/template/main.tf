module "api-east" {
  source         = "../api/"
  environment    = var.environment
  dns_domain     = var.dns_domain
  authorizer_uri = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id     = data.aws_caller_identity.current.account_id
  zone_id        = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-east-1.amazonaws.com"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
  }
}

module "api-west" {
  source         = "../api/"
  environment    = var.environment
  dns_domain     = var.dns_domain
  authorizer_uri = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  account_id     = data.aws_caller_identity.current.account_id
  zone_id        = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    DYNAMODB_ENDPOINT = "dynamodb.us-west-1.amazonaws.com"
  })
  region   = "us-west-1"
  validate = 0
  providers = {
    aws = aws.us-west-1
  }
}
