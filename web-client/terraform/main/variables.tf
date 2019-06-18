variable "aws_region" {
  type    = "string"
  default = "us-east-1"
}

variable "environment" {
  type = "string"
}

variable "dns_domain" {
  type = "string"
}

variable "cloudfront_default_ttl" {
  type = "string"
  default = "0"
}

variable "cloudfront_max_ttl" {
  type = "string"
  default = "0"
}

variable "git_access_token" {
  type = "string"
}

variable "product_keys" {
  type = "string"
}

variable "dynamsoft_zip_name" {
  type = "string"
}

variable "dynamsoft_repo" {
  type = "string"
}