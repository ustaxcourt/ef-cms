resource "aws_cognito_user_pool" "pool" {
  name = "efcms-${var.environment}"

  auto_verified_attributes = ["email"]

  username_attributes = ["email"]

  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_message_by_link = "Please click the link below to verify your email address. {##Verify Email##} "
    email_subject_by_link = "U.S. Tax Court account verification"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  sms_authentication_message = "{####}"

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_confirmation_lambda.arn
    post_authentication = aws_lambda_function.cognito_post_authentication_lambda.arn
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
    invite_message_template {
      sms_message   = "Your username is {username} and temporary password is {####}."
      email_subject = "An account has been set up for you with the U.S. Tax Court"
      email_message = "Welcome to DAWSON, the new U.S. Tax Court case management system.  An account has been created for you to access your cases online.<br /><br />Please verify that your contact information is correct in the system, and make any required changes.<br /><br /><hr /><br /><br /><b>Your username:</b> {username}</br /><br /><b>Temporary password:</b> <span style=\"font-family: 'Courier New', Courier, monospace;\">{####}</span><br /><br /><b>This temporary password is valid for 7 days. </b> <a href='https://app.${var.dns_domain}/'>Log in to DAWSON to change your password.</a><br /><br />NOTE:<br />1. Make sure your username and password are entered exactly as they appear in the welcome email -- both are case sensitive.<br />2. Please copy and paste the temporary password versus trying to retype it.<br />3. Please make sure you do not pick up an extra space at the beginning or end of the password when copying and pasting.<br />4. If your password ends with a special character or punctuation (.?,), that is part of your temporary password. <br /><br />"
    }
  }

  email_configuration { # Use SES to send email
    source_arn             = aws_ses_email_identity.ses_sender.arn
    email_sending_account  = "DEVELOPER"
    reply_to_email_address = "noreply@${var.dns_domain}"
    from_email_address     = "U.S. Tax Court <noreply@${var.dns_domain}>"
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
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH"]

  generate_secret                      = false
  refresh_token_validity               = 30
  allowed_oauth_flows_user_pool_client = true

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

  sms_authentication_message = "{####}"

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_confirmation_lambda.arn
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

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_pool_client" "irs_client" {
  name = "irs_client"

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]

  generate_secret                      = false
  refresh_token_validity               = 30
  allowed_oauth_flows_user_pool_client = true

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
