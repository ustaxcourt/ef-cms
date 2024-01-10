resource "aws_cognito_user_pool" "pool" {
  name = "efcms-${var.environment}"

  auto_verified_attributes = ["email"]

  username_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "role"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "userId"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "name"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  lifecycle {
    prevent_destroy = true

    # the lambda_config isn't specified in this block because we only want to change its configuration during the color-change step of a deployment
    # but we also don't want the lambda_config to be deleted, so we need to ignore its configuration
    ignore_changes = [lambda_config]
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]

  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  refresh_token_validity = 1
  access_token_validity  = 1
  id_token_validity      = 1

  callback_urls = [
    "http://localhost:1234/log-in",
    "https://app.${var.dns_domain}/log-in",
  ]

  allowed_oauth_flows          = ["code", "implicit"]
  allowed_oauth_scopes         = ["email", "openid", "profile", "phone", "aws.cognito.signin.user.admin"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = aws_cognito_user_pool.pool.id

  write_attributes = [
    "address",
    "birthdate",
    "email",
    "family_name",
    "gender",
    "given_name",
    "locale",
    "middle_name",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "preferred_username",
    "profile",
    "updated_at",
    "website",
    "zoneinfo",
  ]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "auth-${var.environment}-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool" "irs_pool" {
  name = "efcms-irs-${var.environment}"

  mfa_configuration = "ON"

  software_token_mfa_configuration {
    enabled = true
  }

  auto_verified_attributes = ["email"]

  username_attributes = ["email"]

  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_message_by_link = "Please click the link below to verify your email address. {##Verify Email##} "
    email_subject_by_link = "U.S. Tax Court account verification"
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
    invite_message_template {
      sms_message   = "Your username is {username} and temporary password is {####}."
      email_subject = "U.S. Tax Court account creation"
      email_message = "An account has been created for you on the <a href='https://app.${var.dns_domain}/'>U.S. Tax Court site</a>. Your username is {username} and temporary password is {####}. Please log in and change your password."
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "role"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "name"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "admin_only"
      priority = 1
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_pool_client" "irs_client" {
  name = "irs_client"

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]

  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  refresh_token_validity = 30 # irs app expects 30 days
  access_token_validity  = 1
  id_token_validity      = 1

  callback_urls = [
    "http://localhost:1234/log-in",
    "https://app.${var.dns_domain}/log-in",
  ]

  allowed_oauth_flows          = ["code", "implicit"]
  allowed_oauth_scopes         = ["email", "openid", "profile", "phone", "aws.cognito.signin.user.admin"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = aws_cognito_user_pool.irs_pool.id

  write_attributes = [
    "address",
    "birthdate",
    "email",
    "family_name",
    "gender",
    "given_name",
    "locale",
    "middle_name",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "preferred_username",
    "profile",
    "updated_at",
    "website",
    "zoneinfo",
  ]
}

resource "aws_cognito_user_pool_domain" "irs" {
  domain       = "auth-irs-${var.environment}-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.irs_pool.id
}
