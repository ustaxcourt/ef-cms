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
        "dynamodb:DescribeStream",
        "dynamodb:GetItem",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:ListStreams",
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:DeleteItem"
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
        "sqs:ReceiveMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "es:ESHttpGet",
        "es:ESHttpPost"
      ],
      "Resource": "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-${var.environment}-*",
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
        "dynamodb:DeleteItem",
        "dynamodb:DescribeStream",
        "dynamodb:GetItem",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
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
        "sqs:ReceiveMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::${var.dns_domain}-documents-*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "es:ESHttpGet",
        "es:ESHttpPost"
      ],
      "Resource": "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-${var.environment}-*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role" "migration_status_role" {
  name = "migration_status_role_${var.environment}"

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

resource "aws_iam_role_policy" "migration_status_policy" {
  name = "migration_status_policy_${var.environment}"
  role = aws_iam_role.migration_status_role.id

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
      "Sid": "Other",
      "Effect": "Allow",
      "Action": [
        "es:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatch",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SQS",
      "Effect": "Allow",
      "Action": [
        "sqs:GetQueueAttributes"
      ],
      "Resource": [
        "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:migration_segments_queue_${var.environment}",
        "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:migration_segments_dl_queue_${var.environment}"
      ]
    },
    {
      "Sid": "DynamoDB",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-deploy-${var.environment}"
      ]
    }
  ]
}
EOF
}
