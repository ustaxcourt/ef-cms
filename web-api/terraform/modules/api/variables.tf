variable "environment" {
  type = string
}

variable "lambda_role_arn" {
  type = string
}

variable "dns_domain" {
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

variable "current_color" {
  type = string
}

variable "lambda_bucket_id" {
  type = string
}

variable "create_check_case_cron" {
  type = number
}

variable "create_streams" {
  type = number
}

variable "stream_arn" {
  type = string
}

variable "create_triggers" {
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

variable "alert_sns_topic_arn" {
  type = string
}

