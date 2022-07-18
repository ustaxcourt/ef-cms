variable "zone_name" {
  type = string
}

variable "es_logs_instance_count" {
  type    = string
  default = "1"
}

variable "es_logs_instance_type" {
  type    = string
  default = "t2.medium.elasticsearch"
}

variable "es_logs_ebs_volume_size_gb" {
  type    = number
  default = 20
}

variable "log_group_environments" {
  description = "deployment environments"
  type        = list(string)
  default     = ["dev", "stg"]
}

variable "cognito_suffix" {
  type = string
}

variable "number_of_days_to_keep_info_logs" {
  type = number
}
