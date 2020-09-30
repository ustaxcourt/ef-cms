variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "cognito_suffix" {
  type = string
}

variable "email_dmarc_policy" {
  type = string
}

variable "es_instance_count" {
  type    = string
  default = "1"
}

variable "honeybadger_key" {
  type    = string
  default = "default_key"
}

variable "irs_superuser_email" {
  type = string
}

variable "deploying_color" {
  type    = string
  default = "green"
}

variable "blue_table_name" {
  type = string
}

variable "green_table_name" {
  type = string
}

variable "blue_elasticsearch_domain" {
  type = string
}

variable "green_elasticsearch_domain" {
  type = string
}

variable "destination_table" {
  type = string
}
