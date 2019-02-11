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
    "http://localhost:3000/log-in", 
    "https://ui-${var.environment}.${var.dns_domain}/log-in"
  ]

  allowed_oauth_flows    = ["code", "implicit"]
  allowed_oauth_scopes   = ["email", "openid", "profile", "phone", "aws.cognito.signin.user.admin"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}


module "cognito-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate?ref=v0.1.2"

  domain_name            = "auth-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "auth-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for auth-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
}


resource "aws_cognito_user_pool_domain" "main" {
  domain       = "efcms-auth-${var.environment}"
  # certificate_arn = "${module.cognito-certificate.acm_certificate_arn}"
  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}

# data "aws_route53_zone" "zone" {
#   name = "${var.dns_domain}."
# }

# resource "aws_route53_record" "www" {
#   zone_id = "${data.aws_route53_zone.zone.zone_id}"
#   name    = "auth-${var.environment}.${var.dns_domain}"
#   type    = "A"

#   alias = {
#     name                   = "${aws_cognito_user_pool_domain.main.domain_name}"
#     zone_id                = "${aws_cloudfront_distribution.distribution.hosted_zone_id}"
#     evaluate_target_health = false
#   }
# }