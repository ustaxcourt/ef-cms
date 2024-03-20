variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "cognito_suffix" {
  type = string
}

variable "email_dmarc_policy" {
  type = string
}

variable "es_instance_count" {
  type    = string
  default = "1"
}

variable "es_instance_type" {
  type    = string
  default = "t2.small.search"
}

variable "irs_superuser_email" {
  type = string
}

variable "blue_table_name" {
  type = string
}

variable "green_table_name" {
  type = string
}

variable "blue_elasticsearch_domain" {
  type = string
}

variable "green_elasticsearch_domain" {
  type = string
}

variable "destination_table" {
  type = string
}

variable "disable_emails" {
  type    = bool
  default = false
}

variable "es_volume_size" {
  type = number
}

variable "bounced_email_recipient" {
  type = string
}

variable "bounce_alert_recipients" {
  type = string
}

variable "slack_webhook_url" {
  type = string
}

variable "scanner_resource_uri" {
  type = string
}

variable "cognito_table_name" {
  type = string
}

variable "prod_env_account_id" {
  type = string
}

variable "lower_env_account_id" {
  type = string
}

variable "should_es_alpha_exist" {
  type = bool
}

variable "should_es_beta_exist" {
  type = bool
}

variable "blue_node_version" {
  type = string
}

variable "green_node_version" {
  type = string
}

variable "blue_use_layers" {
  type    = bool
  default = true
}

variable "green_use_layers" {
  type    = bool
  default = true
}

variable "default_account_pass" {
  type = string
}

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}

variable "deployment_timestamp" {
  type = number
}
