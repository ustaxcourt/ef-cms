variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "authorizer_uri" {
  type = string
}

variable "account_id" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "lambda_environment" {
  type = map(any)
}

variable "region" {
  type = string
}

variable "validate" {
  type = number
}
