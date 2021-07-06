resource "aws_iam_role" "migration_role" {
  name = "migration_role_${var.environment}"

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


resource "aws_iam_role_policy" "migration_policy" {
  name = "migration_policy_${var.environment}"
  role = aws_iam_role.migration_role.id

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
                "dynamodb:BatchWriteItem",
                "dynamodb:DeleteItem",
                "dynamodb:DescribeStream",
                "dynamodb:GetItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListShards",
                "dynamodb:ListStreams",
                "dynamodb:Query",
                "dynamodb:PutItem",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "sqs:DeleteMessage",
                "sqs:SendMessage",
                "sqs:SendMessageBatch",
                "sqs:ReceiveMessage",
                "sqs:GetQueueAttributes"
            ],
            "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:*",
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "migration_segments_role" {
  name = "migration_segments_role_${var.environment}"

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

resource "aws_iam_role_policy" "migration_segments_policy" {
  name = "migration_segments_policy_${var.environment}"
  role = aws_iam_role.migration_segments_role.id

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
                "dynamodb:BatchWriteItem",
                "dynamodb:DescribeStream",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListShards",
                "dynamodb:ListStreams",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "sqs:DeleteMessage",
                "sqs:SendMessage",
                "sqs:SendMessageBatch",
                "sqs:ReceiveMessage",
                "sqs:GetQueueAttributes"
            ],
            "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:*",
            "Effect": "Allow"
        }
    ]
}
EOF
}
