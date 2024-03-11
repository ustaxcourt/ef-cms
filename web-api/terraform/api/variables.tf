variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "account_id" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "pool_arn" {
  type = string
}

variable "lambda_environment" {
  type = map(any)
}

variable "region" {
  type = string
}

variable "validate" {
  type = number
}

variable "deploying_color" {
  type = string
}

variable "current_color" {
  type = string
}

variable "lambda_bucket_id" {
  type = string
}

variable "api_object" {
  type = any
}

variable "send_emails_object" {
  type = any
}

variable "send_emails_object_hash" {
  type = any
}

variable "trial_session_object_hash" {
  type = any
}

variable "trial_session_object" {
  type = any
}

variable "api_public_object" {
  type = any
}

variable "websockets_object" {
  type = any
}

variable "pdf_generation_object" {
  type = any
}

variable "maintenance_notify_object" {
  type = any
}

variable "puppeteer_layer_object" {
  type = any
}

variable "cron_object" {
  type = any
}

variable "streams_object" {
  type = any
}

variable "public_object_hash" {
  type = string
}

variable "pdf_generation_object_hash" {
  type = string
}

variable "api_object_hash" {
  type = string
}

variable "websockets_object_hash" {
  type = string
}

variable "maintenance_notify_object_hash" {
  type = string
}

variable "puppeteer_object_hash" {
  type = string
}

variable "cron_object_hash" {
  type = string
}

variable "streams_object_hash" {
  type = string
}

variable "create_health_check_cron" {
  type = number
}

variable "create_check_case_cron" {
  type = number
}

variable "create_streams" {
  type = number
}

variable "create_maintenance_notify" {
  type = number
}

variable "stream_arn" {
  type = string
}

variable "create_triggers" { // ZACH YOU LEFT OFF HERE
  type    = number
  default = 1
}

variable "web_acl_arn" {
  type = string
}

variable "create_seal_in_lower" {
  type = number
}

variable "prod_env_account_id" {
  type = string
}

variable "create_bounce_handler" {
  type = number
}

variable "node_version" {
  type = string
}

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}

variable "health_check_id" {
  type = string
}
