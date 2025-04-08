variable "postgres_master_password" {
  type = string
}

variable "postgres_master_username" {
  type = string
}

variable "environment" {
  type = string
}

variable "engine_version" {
  type    = string
  default = "15.4"
}

variable "delete_protection" {
  type    = bool
  default = true
}

variable "kms_key_id_primary" {
  type = string
}

variable "kms_key_id_replica" {
  type = string
}

variable "max_capacity" {
  type    = number
  default = 1.0
}

variable "min_capacity" {
  type    = number
  default = 0.5
}

variable "restoring_aws_account_id" {
  type = string
}

