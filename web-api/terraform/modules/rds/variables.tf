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
  type = string 
  default = "15.4"
}