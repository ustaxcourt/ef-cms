data "aws_caller_identity" "current" {}

module "header_security_lambda" {
  source         = "../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-client/terraform/common/cloudfront-edge/header-security-lambda.js"
  handler_method = "handler"
  lambda_name    = "header_security_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/header_security_lambda_role_${var.environment}"
  environment    = {}
  publish        = true

}
