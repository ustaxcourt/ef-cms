data "aws_caller_identity" "current" {}


resource "aws_iam_user" "rds_user_dawson" {
  name = "${var.environment}_dawson"
}

resource "aws_iam_user" "rds_user_developers" {
  name = "${var.environment}_developers"
}

resource "aws_iam_policy" "rds_connect_policy" {
  name        = "RDSConnectPolicy-${var.environment}"
  description = "Policy to allow RDS IAM authentication"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "rds-db:connect",
        Resource = [
          "arn:aws:rds-db:*:${data.aws_caller_identity.current.account_id}:dbuser:*/${aws_iam_user.rds_user_dawson.name}",
          "arn:aws:rds-db:*:${data.aws_caller_identity.current.account_id}:dbuser:*/${aws_iam_user.rds_user_developers.name}"
        ]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "attach_rds_connect_policy" {
  name = "attach-rds-connect-policy-${var.environment}"
  users = [
    aws_iam_user.rds_user_dawson.name,
    aws_iam_user.rds_user_developers.name
  ]
  policy_arn = aws_iam_policy.rds_connect_policy.arn
}

