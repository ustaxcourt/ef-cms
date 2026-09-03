resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global"

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
  #checkov:skip=CKV_AWS_290: API GW CloudWatch logging role requires logs:* on Resource: * — AWS mandates this exact policy for the account-level CloudWatch logging role (see AWS docs on API GW account settings)
  #checkov:skip=CKV_AWS_355: same reason as CKV_AWS_290 — CloudWatch Logs APIs require wildcard resource for cross-log-group account-level access
  name = "cloudwatch_policy"
  role = aws_iam_role.cloudwatch.id

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

resource "aws_api_gateway_account" "cloudwatch_role" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}
