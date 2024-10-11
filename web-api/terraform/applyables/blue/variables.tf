variable "all_colors_tfstate_bucket" {
  type = string
}

variable "all_colors_tfstate_key" {
  type = string
}

variable "environment" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "blue_table_name" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "blue_elasticsearch_domain" {
  type = string
}

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}

variable "prod_env_account_id" {
  type = string
}

variable "deployment_timestamp" {
  type = number
}

variable "lower_env_account_id" {
  type = string
}

variable "bounce_alert_recipients" {
  type = string
}

variable "bounced_email_recipient" {
  type = string
}

variable "cognito_suffix" {
  type = string
}

variable "default_account_pass" {
  type = string
}

variable "disable_emails" {
  type = string
}

variable "irs_superuser_email" {
  type = string
}

variable "scanner_resource_uri" {
  type = string
}

variable "slack_webhook_url" {
  type = string
}

variable "viewer_protocol_policy" {
  type    = string
  default = "redirect-to-https"
}
