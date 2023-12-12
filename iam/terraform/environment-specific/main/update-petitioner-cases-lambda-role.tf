resource "aws_iam_role" "iam_update_petitioner_cases_lambda_role" {
  name = "iam_update_petitioner_cases_lambda_role_${var.environment}"

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


resource "aws_iam_role_policy" "iam_update_petitioner_cases_lambda_policy" {
  name = "iam_update_petitioner_cases_lambda_policy_${var.environment}"
  role = aws_iam_role.iam_update_petitioner_cases_lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-deploy-${var.environment}"
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
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutObject",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::${var.dns_domain}-documents-*",
                "arn:aws:s3:::${var.dns_domain}-temp-documents-*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "sqs:GetQueueAttributes",
                "sqs:ListQueueTags",
                "sqs:CreateQueue",
                "sqs:SetQueueAttributes",
                "sqs:SendMessageBatch",
                "sqs:SendMessage",
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage",
                "sqs:DeleteQueue"
            ],
            "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:update_petitioner_cases_queue_${var.environment}_*",
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
                "sqs:SendMessage",
                "sqs:DeleteMessage"
            ],
            "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:send_emails_queue_${var.environment}_*",
            "Effect": "Allow"
        }
    ]
}
EOF
}
