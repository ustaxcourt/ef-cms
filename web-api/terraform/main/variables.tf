variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = "string"
}

variable "dns_domain" {
  type = "string"
}

variable "cognito_suffix" {
  type = "string"
}