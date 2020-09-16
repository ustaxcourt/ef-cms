resource "aws_cognito_user_pool" "log_viewers" {
  name = "log_viewers"
  password_policy {
    minimum_length = 8
  }
}

resource "aws_cognito_user_pool_domain" "log_viewers" {
  domain       = "ef-cms-info"
  user_pool_id = aws_cognito_user_pool.log_viewers.id
}

resource "aws_cognito_user_pool_client" "kibana" {
  name = "kibana"

  user_pool_id = aws_cognito_user_pool.log_viewers.id
}

resource "aws_cognito_identity_pool" "log_viewers" {
  identity_pool_name = "kibana dashboard identity pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = "${aws_cognito_user_pool_client.kibana.id}"
    provider_name           = "${aws_cognito_user_pool.log_viewers.endpoint}"
    server_side_token_check = false
  }
}

resource "aws_iam_role" "es_kibana_role" {
  name = "es_kibana_role"
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
  policy_arn = "arn:aws:iam::aws:policy/AmazonESCognitoAccess"
}
