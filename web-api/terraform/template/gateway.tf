resource "aws_api_gateway_account" "account_us_east_1" {
  cloudwatch_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/api_gateway_cloudwatch_global"
  provider = "aws.us-east-1"
}

resource "aws_api_gateway_account" "account_us_west_2" {
  cloudwatch_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/api_gateway_cloudwatch_global"
  provider = aws.us-west-1
}