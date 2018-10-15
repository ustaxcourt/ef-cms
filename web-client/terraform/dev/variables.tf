variable "aws_region" {
  type    = "string"
}

variable "environment" {}

variable "deployment" {}
variable "dns_domain" {}

variable "cloudfront_default_ttl" {
  type = "string"
  default = "0"
}

variable "cloudfront_max_ttl" {
  type = "string"
  default = "0"
}