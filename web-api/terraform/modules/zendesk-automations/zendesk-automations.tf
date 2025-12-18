# This file helps facilitate Zendesk Automations, which lives in another account

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "zendesk_automations_role" {
  count = var.zendesk_aws_account_id != "" ? 1 : 0
  name = "zendesk-automations-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          AWS = [
            "arn:aws:sts::${var.zendesk_aws_account_id}:assumed-role/zendesk-automations-lambda-exec/zendesk-automations-handleTicket",
            "arn:aws:sts::${var.zendesk_aws_account_id}:assumed-role/zendesk-automations-cicd-deployer-role/GitHubActions"
          ]
        },
        Condition = {
          StringEquals = {
            "sts:RoleSessionName" = "ZendeskAutomationsSession"
          }
        }
        Effect ="Allow",
      }
    ]
  })
}

resource "aws_iam_role_policy" "zendesk_automations_policy" {
  count = var.zendesk_aws_account_id != "" ? 1 : 0
  name = "zendesk-automations-lambda-role-policy"
  role = aws_iam_role.zendesk_automations_role[0].id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "cognito-idp:AdminUpdateUserAttributes",
          "cognito-idp:ResendConfirmationCode",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminEnableUser",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminInitiateAuth",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:ListUsers",
        ]
        Effect = "Allow",
        Resource = "arn:aws:cognito-idp:us-east-1:${data.aws_caller_identity.current.account_id}:userpool/${var.cognito_user_pool}"
      },
      {
        Action = [
          "ses:ListSuppressedDestinations",
          "ses:DeleteSuppressedDestination",
        ]
        Effect = "Allow",
        Resource = "*"
      }
    ]
  })
}
