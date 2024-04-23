provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "5.45.0"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role_policy" "court_user_policy" {
  name = "efcms_remote_user_policy_${var.remote_account_number}"
  role = aws_iam_role.court_user_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:BatchWriteItem",
                "dynamodb:PutItem",
                "dynamodb:DescribeTable",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:${data.aws_caller_identity.current.account_id}:table/*"
            ]
        }
    ]
}
  EOF
}

resource "aws_iam_role" "court_user_role" {
  name = "efcms_remote_user_${var.remote_account_number}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${var.remote_account_number}:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {}
    }
  ]
}
EOF
}
