resource "aws_cognito_user_pool" "pool-case-insensitive" {
  name = "efcms-${var.environment}-case-insensitive"

  username_attributes = ["email"]
  username_configuration {
    case_sensitive = false
  }
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = <<EMAILMESSAGE
    <div>
    <div>
      Hello DAWSON user, 
    </div>
    <div style="margin-top: 20px;">
    You have requested a password reset. Use the code below to reset your password. <span style="font-weight: bold;">This will expire in one hour.</span>
    </div>
    <div style="margin-top: 20px;">
      <span style="font-weight: bold; font-size: 20px;">{####}</span>
    </div>
    <div style="margin-top: 20px;">
      <span>If you did not request to reset your password, contact <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>

    <hr style="border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages sent to this email address.</span>
    </div>
  </div>
  EMAILMESSAGE
    email_subject        = "U.S. Tax Court DAWSON: Password Reset Code"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
    invite_message_template {
      sms_message   = "Your username is {username} and temporary password is {####}."
      email_subject = "U.S. Tax Court DAWSON: Account Created"
      email_message = <<EMAILMESSAGE
      <div>
        <div>
          Hello DAWSON user, 
        </div>
        <div style="margin-top: 20px;">
          Welcome to DAWSON, the U.S. Tax Court case management system. An account has been created for you to access your cases online.
        </div>
        <div style="margin-top: 20px;">
          Please verify that your contact information is correct in the system, and make any required changes.
        </div>
        <div style="margin-top: 20px;"> 
          <span style="font-weight: bold;">Your username: </span>{username}
        </div>
        <div> 
          <span style="font-weight: bold;">Temporary password: </span> <span style="font-family: 'Courier New', Courier, monospace;">{####}</span>
        </div>
        <div style="margin-top: 20px;">
          <span style="font-weight: bold;">This temporary password is valid for 7 days.</span> <a href='https://app.${var.dns_domain}/'>Log in to DAWSON to change your password.</a>
        </div>
        <div style="margin-top: 20px;">NOTE:</div>
        <div>
          1. Make sure your username and password are entered exactly as they appear in the welcome email -- both are case sensitive.
        </div>
        <div>
          2. Please copy and paste the temporary password versus trying to retype it.
        </div>
        <div>
          3. Please make sure you do not pick up an extra space at the beginning or end of the password when copying and pasting.
        </div>
        <div>
          4. If your password ends with a special character or punctuation (.?,), that is part of your temporary password.
        </div>

        <div style="margin-top: 20px;">
          <span>If you did not request an account with DAWSON, contact <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
        </div>
        <hr style="border-top:1px solid #000000;">
        <div style="margin-top: 20px;">
          <span>This is an automated email. We are unable to respond to any messages sent to this email address.</span>
        </div>
      </div>
    EMAILMESSAGE
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

    # the lambda_config isn't specified in this block because we only want to change its configuration during the color-change step of a deployment
    # but we also don't want the lambda_config to be deleted, so we need to ignore its configuration
    ignore_changes = [lambda_config]
  }
}

# TODO 10007 Cleanup: Remove this block when we no longer need to handle users who bookmarked the legacy login URL
resource "aws_cognito_user_pool_domain" "main-case-insensitive" {
  domain       = "auth-${var.environment}-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_client" "client-case-insensitive" {
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

  # TODO 10007 Cleanup: remove when triggers are removed 
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
    "custom:userId",
    "custom:role",
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

resource "aws_cognito_user_pool" "irs_pool-case-insensitive" {
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
      email_subject = "U.S. Tax Court DAWSON: Account Created"
      email_message = <<EMAILMESSAGE
      <div>
        <div>
          Hello DAWSON user, 
        </div>
        <div style="margin-top: 20px;">
          Welcome to DAWSON, the U.S. Tax Court case management system. An account has been created for you to access your cases online.
        </div>
        <div style="margin-top: 20px;">
          Please verify that your contact information is correct in the system, and make any required changes.
        </div>
        <div style="margin-top: 20px;"> 
          <span style="font-weight: bold;">Your username: </span>{username}
        </div>
        <div> 
          <span style="font-weight: bold;">Temporary password: </span> <span style="font-family: 'Courier New', Courier, monospace;">{####}</span>
        </div>
        <div style="margin-top: 20px;">
          <span style="font-weight: bold;">This temporary password is valid for 7 days.</span> <a href='https://app.${var.dns_domain}/'>Log in to DAWSON to change your password.</a>
        </div>
        <div style="margin-top: 20px;">NOTE:</div>
        <div>
          1. Make sure your username and password are entered exactly as they appear in the welcome email -- both are case sensitive.
        </div>
        <div>
          2. Please copy and paste the temporary password versus trying to retype it.
        </div>
        <div>
          3. Please make sure you do not pick up an extra space at the beginning or end of the password when copying and pasting.
        </div>
        <div>
          4. If your password ends with a special character or punctuation (.?,), that is part of your temporary password.
        </div>

        <div style="margin-top: 20px;">
          <span>If you did not request an account with DAWSON, contact <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
        </div>
        <hr style="border-top:1px solid #000000;">
        <div style="margin-top: 20px;">
          <span>This is an automated email. We are unable to respond to any messages sent to this email address.</span>
        </div>
      </div>
    EMAILMESSAGE      
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

resource "aws_cognito_user_pool_client" "irs_client-case-insensitive" {
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

  # TODO 10007 Cleanup: remove when triggers are removed 
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

resource "aws_cognito_user_pool_domain" "irs-case-insensitive" {
  domain       = "auth-irs-${var.environment}-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.irs_pool.id
}
