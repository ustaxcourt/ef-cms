variable "cognito_suffix" {
  type = string
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
}

variable "log_snapshot_bucket_name" {
  type    = string
}

variable "number_of_days_to_keep_info_logs" {
  type    = number
}

variable "sns_alarm_arn" {
  type = string
}
