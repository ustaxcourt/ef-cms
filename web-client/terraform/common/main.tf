provider "aws" {
  alias = "us-east-1"
}

provider "aws" {
  alias = "us-west-1"
}

module "ui-green" {
  source                 = "../ui"
  current_color          = "green"
  environment            = var.environment
  dns_domain             = var.dns_domain
  cloudfront_max_ttl     = var.cloudfront_max_ttl
  cloudfront_default_ttl = var.cloudfront_default_ttl
  zone_name              = var.zone_name
  header_security_arn    = aws_lambda_function.header_security_lambda.qualified_arn
  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "ui-blue" {
  source                 = "../ui"
  current_color          = "blue"
  environment            = var.environment
  dns_domain             = var.dns_domain
  cloudfront_max_ttl     = var.cloudfront_max_ttl
  cloudfront_default_ttl = var.cloudfront_default_ttl
  zone_name              = var.zone_name
  header_security_arn    = aws_lambda_function.header_security_lambda.qualified_arn
  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}
