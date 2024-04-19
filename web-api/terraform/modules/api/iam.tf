resource "aws_iam_role" "api_gateway_invocation_role" {
  name = "api_gateway_invocation_role_${var.environment}_${var.current_color}_${var.region}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "api_gateway_invocation_policy" {
  name = "api_gateway_invocation_policy_${var.environment}_${var.current_color}_${var.region}"
  role = aws_iam_role.api_gateway_invocation_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "lambda:InvokeFunction",
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}