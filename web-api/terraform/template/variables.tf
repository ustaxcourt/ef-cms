variable "aws_region" {
  default = "us-east-1"
}

variable "active_ses_ruleset" {
  type = string
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
  type = string
}

variable "es_instance_type" {
  type = string
}

variable "irs_superuser_email" {
  type = string
}

variable "deploying_color" {
  type = string
}

variable "blue_table_name" {
  type = string
}

variable "default_account_pass" {
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

variable "log_level" {
  type    = string
  default = "info"
}

variable "alert_sns_topic_arn" {
  type = string
}

variable "alert_sns_topic_west_arn" {
  type = string
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

variable "green_node_version" {
  type = string
}

variable "blue_node_version" {
  type = string
}


variable "green_use_layers" {
  type = string
}

variable "blue_use_layers" {
  type = string
}

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}

variable "deployment_timestamp" {
  type = number
}

variable "template_lambdas" {
  type = list(string)
  default = [
    "api-public.js",
    "api.js",
    "cognito-authorizer.js",
    "cognito-triggers.js",
    "cron.js",
    "handle-bounced-service-email.js",
    "maintenance-notify.js",
    "pdf-generation.js",
    "public-api-authorizer.js",
    "report.html",
    "seal-in-lower-environment.js",
    "send-emails.js",
    "streams.js",
    "trial-session.js",
    "websocket-authorizer.js",
    "websockets.js",
    "worker-handler.js",
  ]
}
