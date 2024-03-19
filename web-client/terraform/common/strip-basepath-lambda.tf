
module "strip_basepath_lambda" {
  source         = "../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-client/terraform/common/cloudfront-edge/strip-basepath-lambda.js"
  handler_method = "handler"
  lambda_name    = "strip_basepath_lambda_${var.environment}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/strip_basepath_lambda_role_${var.environment}"
  environment    = {}

}

