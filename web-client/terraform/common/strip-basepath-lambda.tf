resource "aws_iam_role" "strip_basepath_lambda_role" {
  name = "strip_basepath_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_role_policy" "strip_basepath_lambda_policy" {
  name = "strip_basepath_lambda_policy_${var.environment}"
  role = aws_iam_role.strip_basepath_lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
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

module "strip_basepath_lambda" {
  source         = "../../../web-api/terraform/modules/lambda"
  handler_file   = "./web-client/terraform/common/cloudfront-edge/strip-basepath-lambda.ts"
  handler_method = "handler"
  lambda_name    = "strip_basepath_lambda_${var.environment}"
  role           = aws_iam_role.strip_basepath_lambda_role.arn
  environment    = {}
  publish        = true
  use_source_maps = false
}

moved {
  from = aws_lambda_function.strip_basepath_lambda
  to   = module.strip_basepath_lambda.aws_lambda_function.lambda_function
}
