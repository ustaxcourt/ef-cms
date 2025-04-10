variable "postgres_user" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "current_color" {
  type = string
}

variable "environment" {
  type = string
}

variable "postgres_database" {
  type = string
}

variable "postgres_host" {
  type = string
}
