
data "archive_file" "record_modifier_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/record-modifier.js.zip"
  source_file = "${path.module}/lambdas/dist/record-modifier.js"
}

resource "aws_lambda_function" "record_modifier_lambda" {
  filename         = data.archive_file.record_modifier_zip.output_path
  function_name    = "record_modifier_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/record_modifier_role_${var.environment}"
  handler          = "record-modifier.handler"
  source_code_hash = data.archive_file.record_modifier_zip.output_base64sha256

  runtime     = "nodejs12.x"
  timeout     = "900"
  memory_size = "3008"

  environment {
    variables = {
      ENVIRONMENT = var.environment
      SEGMENTS_QUEUE_URL   = aws_sqs_queue.migration_segments_queue.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "segments_mapping" {
  event_source_arn = aws_sqs_queue.migration_segments_queue.arn
  function_name    = aws_lambda_function.record_modifier_lambda.arn
  batch_size       = 1
}

resource "aws_iam_role" "record_modifier_role" {
  name = "record_modifier_role_${var.environment}"

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


resource "aws_iam_role_policy" "record_modifier_policy" {
  name = "record_modifier_policy_${var.environment}"
  role = aws_iam_role.record_modifier_role.id

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
                "sqs:*"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
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
