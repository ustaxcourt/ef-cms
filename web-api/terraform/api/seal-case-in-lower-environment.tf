resource "aws_lambda_function" "zip_seal" {
  count            = var.create_seal_in_lower
  depends_on       = [var.seal_in_lower_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "seal_in_lower_${var.current_color}.js.zip"
  source_code_hash = var.seal_in_lower_object_hash
  function_name    = "seal_in_lower_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = ".handler"
  timeout          = "60"
  memory_size      = "768"

  runtime = "nodejs14.x"

  environment {
    variables = var.lambda_environment
  }

  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_iam_role" "lambda_seal_role" {
  name = "lambda_seal_role_${var.environment}"

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


resource "aws_iam_role_policy" "lambda_seal_policy" {
  name = "lambda_seal_policy_${var.environment}"
  role = aws_iam_role.lambda_seal_role.id

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
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:DeleteItem",
                "dynamodb:DescribeStream",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListShards",
                "dynamodb:ListStreams",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*"
            ],
            "Effect": "Allow"
        },
        {
          "Condition": {
            "ArnLike": {
              "AWS:SourceArn": "arn:aws:sns:us-east-1:${var.prod_env_account_id}:sealed_case_notifier"
            }
          },
          "Action": "lambda:InvokeFunction",
          "Resource": "arn:aws:lambda:us-east-1:${data.aws_caller_identity.current.account_id}:function:seal_in_lower_${var.environment}_*",
          "Effect": "Allow",
          "Principal": {
            "Service": "sns.amazonaws.com"
          },
          "Sid": "some-unique-identifier"
        }
    ]
}
EOF
}
