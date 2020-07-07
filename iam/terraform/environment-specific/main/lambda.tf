data "aws_caller_identity" "current" {}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy_${var.environment}"
  role = aws_iam_role.lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*"
            ]
        },
        {
            "Action": [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "arn:aws:lambda:us-east-1:${data.aws_caller_identity.current.account_id}:function:*",
                "arn:aws:lambda:us-west-1:${data.aws_caller_identity.current.account_id}:function:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "cognito-idp:*"
            ],
            "Resource": [
                "arn:aws:cognito-idp:us-east-1:${data.aws_caller_identity.current.account_id}:userpool/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:*"
            ],
            "Resource": "arn:aws:s3:::*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "dynamodb:*"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "ses:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "es:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "execute-api:Invoke",
                "execute-api:ManageConnections"
            ],
            "Resource": [
                "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:*",
                "arn:aws:execute-api:us-west-1:${data.aws_caller_identity.current.account_id}:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}