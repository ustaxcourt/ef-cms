resource "aws_cognito_identity_pool" "rum_identity_pool" {
  identity_pool_name               = "${var.environment}-rum-identity-pool"
  allow_unauthenticated_identities = true
}

resource "aws_iam_role" "rum_unauthenticated_role" {
  name = "rum-unauthenticated-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.rum_identity_pool.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" : "unauthenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "rum_permissions" {
  name = "${var.environment}-rum-permissions"
  role = aws_iam_role.rum_unauthenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "rum:PutRumEvents"
        Resource = aws_rum_app_monitor.app_monitor.arn
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "rum_roles" {
  identity_pool_id = aws_cognito_identity_pool.rum_identity_pool.id

  roles = {
    "unauthenticated" = aws_iam_role.rum_unauthenticated_role.arn
  }
}

resource "aws_rum_app_monitor" "app_monitor" {
  name   = "${var.environment}_dawson_rum_app_monitor"
  domain = "*.${var.domain}"
  app_monitor_configuration {
    allow_cookies       = true
    session_sample_rate = var.sample_rate
    telemetries         = ["performance"]
    identity_pool_id    = aws_cognito_identity_pool.rum_identity_pool.id
  }
  custom_events {
    status = "DISABLED"
  }
}
