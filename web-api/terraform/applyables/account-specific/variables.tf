variable "cognito_suffix" {
  type = string
}

variable "cognito_user_pool" {
  type = string
}

variable "dawson_dev_trusted_role_arns" {
  type    = set(string)
}

variable "es_logs_cluster_arn" {
  type    = string
}

variable "es_logs_consumer_account_ids" {
  type    = list(string)
  default = []
}

variable "es_logs_ebs_volume_size_gb" {
  type    = number
  default = 20
}

variable "es_logs_endpoint" {
  type    = string
}

variable "es_logs_engine_version" {
  type = string
}

variable "es_logs_instance_count" {
  type    = number
  default = 1
}

variable "es_logs_instance_type" {
  type    = string
  default = "t2.medium.elasticsearch"
}

variable "log_group_environments" {
  description = "deployment environments"
  type        = list(string)
  default     = []
}

variable "log_snapshot_bucket_name" {
  type = string
}

variable "lower_env_restore_roles" {
  type = set(string)
}

variable "number_of_days_to_keep_info_logs" {
  type = number
}

variable "zendesk_aws_account_id" {
  type = string
}

variable "zone_name" {
  type = string
}
