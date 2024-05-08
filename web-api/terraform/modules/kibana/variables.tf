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