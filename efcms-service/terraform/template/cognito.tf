resource "aws_cognito_user_pool" "pool" {
  name           = "efcms-${var.environment}"
  
  auto_verified_attributes = ["email"]

  username_attributes = ["email"]
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true

    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  generate_secret     = true
  refresh_token_validity = 30
  allowed_oauth_flows_user_pool_client = true

  callback_urls          = [
    "http://localhost:1234/log-in", 
    "https://ui-${var.environment}.${var.dns_domain}/log-in"
  ]

  allowed_oauth_flows    = ["code", "implicit"]
  allowed_oauth_scopes   = ["email", "openid", "profile", "phone", "aws.cognito.signin.user.admin"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "auth-${var.environment}-${var.cognito_suffix}"
  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}