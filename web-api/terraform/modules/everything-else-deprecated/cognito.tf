resource "aws_cognito_user_pool" "pool" {
  name = "efcms-${var.environment}"

  username_attributes = ["email"]

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
          1. Make sure your password is entered exactly as it appears in the welcome email -- it is case sensitive.
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
        <div style="margin-top: 20px;">
          <span><strong>IMPORTANT:</strong> If you are filing a petition electronically, you must complete the process of filing your petition no later than <strong>11:59 pm Eastern time</strong> on the last date to file. Petitions received by the Court after this time may be untimely and your case may be dismissed.</span>
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
    from_email_address     = "\"U.S. Tax Court\" <noreply@${var.dns_domain}>"
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

  lambda_config {
    pre_sign_up = var.idp_name != "" ? module.cognito_pre_signup_lambda.arn : null
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]

  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = var.idp_name != "" ? true : false

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  refresh_token_validity = 1
  access_token_validity  = 1
  id_token_validity      = 1


  user_pool_id = aws_cognito_user_pool.pool.id

  # WARNING: Do NOT add custom:userId or custom:role to this list. Adding those
  # attributes to this list will allow anyone with a valid access/id token to
  # update their role or userId directly in Cognito.
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

  callback_urls                = var.idp_name != "" ? ["https://app.${var.environment}.ef-cms.ustaxcourt.gov/auth-code"] : null
  allowed_oauth_flows          = var.idp_name != "" ? ["code"] : null
  allowed_oauth_scopes         = var.idp_name != "" ? ["openid", "email", "profile"] : null
  supported_identity_providers = var.idp_name != "" ? [aws_cognito_identity_provider.idp[0].provider_name] : null
}

resource "aws_cognito_user_pool_domain" "domain" {
  count                 = var.idp_name != "" ? 1 : 0
  domain                = "ef-cms-${var.environment}"
  user_pool_id          = aws_cognito_user_pool.pool.id
  managed_login_version = 2
}

resource "aws_cognito_managed_login_branding" "login_branding" {
  count                       = var.idp_name != "" ? 1 : 0
  client_id                   = aws_cognito_user_pool_client.client.id
  user_pool_id                = aws_cognito_user_pool.pool.id
  use_cognito_provided_values = true
}

resource "aws_cognito_identity_provider" "idp" {
  count         = var.idp_name != "" ? 1 : 0
  user_pool_id  = aws_cognito_user_pool.pool.id
  provider_name = var.idp_name
  provider_type = "OIDC"
  provider_details = {
    authorize_scopes          = "openid"
    client_id                 = var.oidc_client_id
    client_secret             = var.oidc_client_secret
    oidc_issuer               = var.oidc_issuer_url
    attributes_request_method = "POST"
  }
  attribute_mapping = {
    name     = "name"
    email    = "email"
    username = "sub"
  }
}
module "cognito_pre_signup_lambda" {
  count          = var.idp_name != "" ? 1 : 0
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cognitoPreSignup/cognitoPreSignupLambda.ts"
  handler_method = "cognitoPreSignupLambdaHandler"
  lambda_name    = "cognito_pre_signup_lambda_${var.environment}"
  role           = aws_iam_role.pre_signup_lambda.arn
  environment = {
    IDP_NAME = var.idp_name
  }
  timeout     = "29"
  memory_size = "128"
}

module "cognito_inbound_federation_lambda" {
  count          = var.idp_name != "" ? 1 : 0
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cognitoInboundFederation/cognitoInboundFederationLambda.ts"
  handler_method = "cognitoInboundFederationLambdaHandler"
  lambda_name    = "cognito_inbound_federation_lambda_${var.environment}"
  role           = aws_iam_role.inbound_federation_lambda.arn
  environment = {
    IDP_NAME = var.idp_name
  }
  timeout     = "29"
  memory_size = "128"
}

resource "aws_lambda_permission" "cognito_pre_signup_lambda_invoke" {
  count         = var.idp_name != "" ? 1 : 0
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.cognito_pre_signup_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

resource "aws_lambda_permission" "cognito_inbound_federation_lambda_invoke" {
  count         = var.idp_name != "" ? 1 : 0
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.cognito_inbound_federation_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

resource "aws_iam_role" "pre_signup_lambda" {
  count = var.idp_name != "" ? 1 : 0
  name  = "pre_signup_lambda_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "apigateway.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "inbound_federation_lambda" {
  count = var.idp_name != "" ? 1 : 0
  name  = "inbound_federation_lambda_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "apigateway.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "presignup_policy" {
  count = var.idp_name != "" ? 1 : 0
  name  = "pre_signup_policy_${var.environment}"
  role  = aws_iam_role.pre_signup_lambda.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminLinkProviderForUser"
      ],
      "Resource": [
        "arn:aws:cognito-idp:us-east-1:${data.aws_caller_identity.current.account_id}:userpool/*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "inbound_federation_policy" {
  count = var.idp_name != "" ? 1 : 0
  name  = "inbound_federation_policy_${var.environment}"
  role  = aws_iam_role.inbound_federation_lambda.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
EOF
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
          1. Make sure your password is entered exactly as it appears in the welcome email -- it is case sensitive.
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
        <div style="margin-top: 20px;">
          <span><strong>IMPORTANT:</strong> If you are filing a petition electronically, you must complete the process of filing your petition no later than <strong>11:59 pm Eastern time</strong> on the last date to file. Petitions received by the Court after this time may be untimely and your case may be dismissed.</span>
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
  allowed_oauth_flows_user_pool_client = false
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  refresh_token_validity = 30 # irs app expects 30 days
  access_token_validity  = 1
  id_token_validity      = 1

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
