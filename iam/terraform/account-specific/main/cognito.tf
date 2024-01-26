resource "aws_cognito_user_pool" "log_viewers" {
  name = "log_viewers"
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }
}

resource "aws_cognito_user_pool_domain" "log_viewers" {
  domain       = "ef-cms-info-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.log_viewers.id
}

resource "aws_cognito_identity_pool" "log_viewers" {
  identity_pool_name               = "kibana dashboard identity pool"
  allow_unauthenticated_identities = false

  lifecycle {
    ignore_changes = [
      cognito_identity_providers # AWS Elasticsearch forces management itself
    ]
  }
}

resource "aws_iam_role" "es_kibana_role" {
  name               = "es_kibana_role"
  assume_role_policy = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
CONFIG
}

resource "aws_iam_role_policy_attachment" "es_cognito_auth" {
  role       = aws_iam_role.es_kibana_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonOpenSearchServiceCognitoAccess"
}
