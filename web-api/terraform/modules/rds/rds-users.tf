data "aws_caller_identity" "current" {}


resource "aws_iam_user" "rds_user_dawson" {
  #checkov:skip=CKV_AWS_273: IAM user used for human developer local RDS access — long-term fix (replace with SSO/federated access) tracked in Devex TICKET-2; roles impractical for interactive psql sessions today
  name = "${var.environment}_dawson"
}

resource "aws_iam_user" "rds_user_developers" {
  #checkov:skip=CKV_AWS_273: IAM user used for human developer local RDS access — long-term fix (replace with SSO/federated access) tracked in Devex TICKET-2; roles impractical for interactive psql sessions today
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

