variable "cognito_suffix" {
  type = string
}

variable "es_logs_instance_type" {
  type    = string
  default = "t2.medium.elasticsearch"
}

variable "es_logs_instance_count" {
  type    = string
  default = "1"
}

variable "es_logs_ebs_volume_size_gb" {
  type    = number
  default = 20
}

variable "sns_alarm_arn" {
  type = string
}

variable "log_group_environments" {
  description = "deployment environments"
  type        = list(string)
}

variable "number_of_days_to_keep_info_logs" {
  type = number
}

variable "log_snapshot_bucket_name" {
  type = string
}

variable "es_logs_engine_version" {
  type = string
}

variable "es_info_cluster_create" {
  default     = false
  description = "Determines whether to create an info opensearch or not"
  type        = bool
}


variable "es_info_cluster_lower_environment_account_ids" {
  default     = []
  description = "List of AWS account that are consumers of the info cluster"
  type        = list(string)
}

variable "es_info_cluster_arn" {
  type = string
}

variable "es_info_cluster_endpoint" {
  type = string
}
