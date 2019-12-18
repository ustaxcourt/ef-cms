resource "aws_api_gateway_account" "account_us_east_1" {
  cloudwatch_role_arn = "${var.cloudwatch_role_arn}"
  provider = "aws.us-east-1"
}

resource "aws_api_gateway_account" "account_us_west_2" {
  cloudwatch_role_arn = "${var.cloudwatch_role_arn}"
  provider = "aws.us-west-1"
}