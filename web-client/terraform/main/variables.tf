variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "cloudfront_default_ttl" {
  type = string
  default = "86400"
}

variable "cloudfront_max_ttl" {
  type = string
  default = "31536000"
}

variable "dynamsoft_s3_zip_path" {
  type = string
}

variable "dynamsoft_url" {
  type = string
}

variable "dynamsoft_product_keys" {
  type = string
}

variable "is_dynamsoft_enabled" {
  default = "1"
  type = string
}