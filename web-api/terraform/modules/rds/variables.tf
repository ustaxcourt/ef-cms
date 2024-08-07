variable "postgres_user" {
  type = string
}

variable "postgres_password" {
  type = string
}

variable "environment" {
  type = string
}

variable "instance_size" {
  type = string
  default = "db.t4g.micro"
}

# variable "subnet_id" {
#   type = string
# }

# variable "group_name" {
#   type = string
# }

variable "vpc_id" {
  type = string
}

# variable "lambdas_security_group_id" {
#   type = string
# }

variable "subnet_group_name" {
  type = string
}