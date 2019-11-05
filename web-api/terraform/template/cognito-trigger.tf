data "archive_file" "zip_triggers" {
  type        = "zip"
  source_file = "${path.module}/cognito-triggers/index.js"
  output_path = "${path.module}/cognito-triggers/index.js.zip"
}

resource "aws_iam_role" "iam_cognito_post_confirmation_lambda_role" {
  name = "iam_cognito_post_confirmation_lambda_role_${var.environment}"

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


resource "aws_iam_role_policy" "iam_cognito_post_confirmation_lambda_policy" {
  name = "iam_cognito_post_confirmation_lambda_policy_${var.environment}"
  role = "${aws_iam_role.iam_cognito_post_confirmation_lambda_role.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem"
            ],
            "Resource": "${aws_dynamodb_table.efcms-east.arn}"
        },
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

resource "aws_lambda_permission" "allow_trigger" {
  statement_id  = "AllowPostConfirmationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.cognito_post_confirmation_lambda.function_name}"
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "${aws_cognito_user_pool.pool.arn}"
}

resource "aws_lambda_function" "cognito_post_confirmation_lambda" {
  filename      = "${data.archive_file.zip_triggers.output_path}"
  function_name = "cognito_post_confirmation_lambda_${var.environment}"
  role          = "${aws_iam_role.iam_cognito_post_confirmation_lambda_role.arn}"
  handler       = "index.handler"
  source_code_hash = "${data.archive_file.zip_triggers.output_base64sha256}"
  
  runtime = "nodejs10.x"

  environment {
    variables = {
      DYNAMO_TABLE = "efcms-${var.environment}"
    }
  }
}