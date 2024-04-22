resource "aws_iam_role" "iam_cognito_post_authentication_lambda_role" {
  name = "iam_cognito_post_authentication_lambda_role_${var.environment}"

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


resource "aws_iam_role_policy" "iam_cognito_post_authentication_lambda_policy" {
  name = "iam_cognito_post_authentication_lambda_policy_${var.environment}"
  role = aws_iam_role.iam_cognito_post_authentication_lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*",
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-deploy-${var.environment}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Action": [
                "es:ESHttpGet"
            ],
            "Resource": [
                "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-${var.environment}-*"
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
                "ses:SendBulkTemplatedEmail"
            ],
            "Resource": [
                "arn:aws:ses:us-east-1:${data.aws_caller_identity.current.account_id}:identity/noreply@${var.dns_domain}"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "sqs:SendMessage"
            ],
            "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:update_petitioner_cases_queue_${var.environment}_*",
            "Effect": "Allow"
        }
    ]
}
EOF
}
