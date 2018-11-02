variable "aws_region" {
  type    = "string"
  default = "us-east-1"
}

variable "environment" {
  type = "string"
}

// dns_domain is determined from the "management" terraform's dns_domain
// see the deploy-app.sh script
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