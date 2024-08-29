variable "postgres_user" {
  type = string
}

variable "postgres_password" {
  type = string
}

variable "environment" {
  type = string
}

variable "engine_version" {
  type    = string
  default = "15.4"
}

variable "postgres_postfix" {
  type    = string
  default = ""
}

variable "postgres_snapshot" {
  type    = string
  default = ""
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
