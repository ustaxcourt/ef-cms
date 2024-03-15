variable "all_colors_tfstate_bucket" {
  type = string
}

variable "all_colors_tfstate_key" {
  type = string
}

variable "green_node_version" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "zone_name" {
  type = string
}

variable "green_table_name" {
  type = string
}

variable "dns_domain" {
  type = string
}
variable "green_elasticsearch_domain" {
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
variable "log_level" {
  type    = string
  default = "info"
}
variable "scanner_resource_uri" {
  type = string
}
variable "slack_webhook_url" {
  type = string
}


