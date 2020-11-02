variable "current_color" {
  type = string
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "cloudfront_max_ttl" {
  type    = string
  default = "31536000"
}

variable "cloudfront_default_ttl" {
  type    = string
  default = "86400"
}

variable "zone_name" {
  type = string
}

variable "header_security_arn" {
  type = string
}

variable "strip_basepath_arn" {
  type = string
}

variable "public_certificate" {
  type = any
}

variable "private_certificate" {
  type = any
}
