variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = "string"
}

variable "dns_domain" {
  type = "string"
}

variable "cognito_suffix" {
  type = "string"
}

variable "ses_dmarc_rua" {
  type = "string"
}

variable "post_confirmation_role_arn" {
  type = "string"
}

variable "cloudwatch_role_arn" {
  type = "string"
}
