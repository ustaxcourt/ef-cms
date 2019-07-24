resource "aws_api_gateway_account" "account_us_east_1" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
  provider = "aws.us-east-1"
}

resource "aws_api_gateway_account" "account_us_west_2" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
  provider = "aws.us-west-1"
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "cloudwatch_policy_${var.environment}"
  role = "${aws_iam_role.cloudwatch.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}