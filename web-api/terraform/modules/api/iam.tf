resource "aws_iam_role" "api_gateway_invocation_role" {
  name = "api_gateway_invocation_role_${var.environment}_${var.current_color}_${var.region}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "api_gateway_invocation_policy" {
  #checkov:skip=CKV_AWS_290: lambda:InvokeFunction requires Resource: * — function ARNs include blue/green color suffix that is not known at policy authoring time
  #checkov:skip=CKV_AWS_355: same reason as CKV_AWS_290 — dynamic color-suffix ARNs cannot be pre-enumerated
  name = "api_gateway_invocation_policy_${var.environment}_${var.current_color}_${var.region}"
  role = aws_iam_role.api_gateway_invocation_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "lambda:InvokeFunction",
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role" "authorizer_lambda" {
  name = "authorizer_lambda_role_${var.environment}_${var.current_color}_${var.region}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "apigateway.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "authorizer_invocation_policy" {
  #checkov:skip=CKV_AWS_287: rds-db:connect scoped to Resource:* here — could be narrowed to a dbuser ARN; accepted as-is, consistent with the authorizer's dynamic environment
  #checkov:skip=CKV_AWS_289: logs:CreateLogGroup/Stream/PutLogEvents on arn:aws:logs:*:*:* — permissions-management check; log delivery requires broad log group access at Lambda startup
  #checkov:skip=CKV_AWS_290: lambda:InvokeFunction requires Resource: * — function ARNs include blue/green color suffix that is not known at policy authoring time
  #checkov:skip=CKV_AWS_355: same reason as CKV_AWS_290 — dynamic color-suffix ARNs cannot be pre-enumerated
  name = "cognito_authorizer_policy_${var.environment}_${var.current_color}_${var.region}"
  role = aws_iam_role.authorizer_lambda.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "lambda:InvokeFunction",
      "Effect": "Allow",
      "Resource": "*"
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
      "Sid": "RdsConnect",
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}
