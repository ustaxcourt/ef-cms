variable "environment" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "es_instance_count" {
  type = string
}

variable "es_instance_type" {
  type = string
}

variable "es_volume_size" {
  type = number
}

variable "alert_sns_topic_arn" {
  type = string
}
