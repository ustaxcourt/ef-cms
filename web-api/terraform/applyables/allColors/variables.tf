variable "environment" {
  type = string
}

variable "active_ses_ruleset" {
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

variable "es_volume_size" {
  type = number
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

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}
