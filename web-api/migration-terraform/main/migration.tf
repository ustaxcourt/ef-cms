
data "archive_file" "migration_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/migration.js.zip"
  source_file = "${path.module}/lambdas/dist/migration.js"
}

resource "aws_lambda_function" "migration_lambda" {
  filename         = data.archive_file.migration_zip.output_path
  function_name    = "migration_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/migration_role_${var.environment}"
  handler          = "migration.handler"
  source_code_hash = data.archive_file.migration_zip.output_base64sha256

  runtime     = "nodejs12.x"
  timeout     = "900"
  memory_size = "3008"

  environment {
    variables = {
      ENVIRONMENT = var.environment
      DESTINATION_TABLE = "exp1-migration"
    }
  }
}

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
                "dynamodb:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_lambda_event_source_mapping" "streams_mapping" {
  event_source_arn  = var.stream_arn
  function_name     = aws_lambda_function.migration_lambda.arn
  starting_position = "TRIM_HORIZON"
}
