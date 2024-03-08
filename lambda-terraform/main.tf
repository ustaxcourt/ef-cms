provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

data "aws_caller_identity" "current" {}


module "cognito_authorizer_lambda_east" {
  source = "../web-api/terraform/api/lambda"
  handler = "./web-api/terraform/template/lambdas/cognito-authorizer.ts"
  file_name = "cognito-authorizer-east"
  function_name = "cognito_authorizer_lambda_exp5"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_exp5"
  environment = {
    NODE_ENV          = "production"
    LOG_LEVEL         = "info"
    STAGE             = "exp5"
  }
  project_root = "/Users/cseibert/Workspace/ef-cms"

  providers = {
    aws = aws.us-east-1
  }
}
