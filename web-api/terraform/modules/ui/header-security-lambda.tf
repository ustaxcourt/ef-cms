data "aws_caller_identity" "current" {}


resource "aws_iam_role" "header_security_lambda_role" {
  name = "header_security_role_${var.environment}_${var.current_color}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_role_policy" "header_security_lambda_policy" {
  name = "header_security_lambda_policy_${var.environment}_${var.current_color}"
  role = aws_iam_role.header_security_lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
EOF
}


module "header_security_lambda" {
  source          = "../lambda"
  handler_file    = "web-api/src/lambdas/headerSecurity/header-security-lambda.ts"
  handler_method  = "handler"
  lambda_name     = "header_security_lambda_${var.environment}_${var.current_color}"
  role            = aws_iam_role.header_security_lambda_role.arn
  environment     = {}
  publish         = true
  use_source_maps = false
}
