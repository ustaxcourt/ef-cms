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


module "migration_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/migration/migration.ts"
  handler_method = "handler"
  lambda_name    = "migration_lambda_${var.environment}"
  role           = aws_iam_role.migration_role.arn
  environment = {
    DESTINATION_TABLE      = var.destination_table
    STAGE                  = var.environment
    NODE_ENV               = "production"
    SOURCE_TABLE           = var.source_table
    ACCOUNT_ID             = data.aws_caller_identity.current.account_id
    DOCUMENTS_BUCKET_NAME  = var.documents_bucket_name
    S3_ENDPOINT            = "s3.us-east-1.amazonaws.com"
    ELASTICSEARCH_ENDPOINT = var.elasticsearch_domain
  }
  timeout = "30"
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn              = var.stream_arn
  function_name                 = module.migration_lambda.arn
  starting_position             = "LATEST"
  maximum_retry_attempts        = 30
  parallelization_factor        = 1
  maximum_record_age_in_seconds = 604800
  destination_config {
    on_failure {
      destination_arn = aws_sqs_queue.migration_failure_queue.arn
    }
  }
}
