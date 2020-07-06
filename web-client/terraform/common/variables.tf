variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "cloudfront_max_ttl" {
  type = string
  default = "31536000"
}

variable "cloudfront_default_ttl" {
  type = string
  default = "86400"
}