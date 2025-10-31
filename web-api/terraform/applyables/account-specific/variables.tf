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
}

variable "cognito_suffix" {
  type = string
}

variable "number_of_days_to_keep_info_logs" {
  type = number
}

variable "dawson_dev_trusted_role_arns" {
  type = set(string)
}

variable "log_snapshot_bucket_name" {
  type = string
}

variable "lower_env_restore_roles" {
  type = set(string)
}

variable "es_logs_engine_version" {
  type = string
}

variable "es_info_cluster_create" {
  default = false
  description = "determines whether to create an info opensearch or not"
  type = bool
}

variable "es_info_cluster_shared_cluster_endpoint" {
  default = ""
  description = "endpoint of info cluster opensearch (used when es_info_cluster_create is false)"
  type = string
}

variable "es_info_cluster_shared_cluster_arn" {
  default = ""
  description = "arn of info cluster opensearch (used when es_info_cluster_create is false)"
  type = string
}

