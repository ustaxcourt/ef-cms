variable "aws_region" {
  default = "us-east-1"
}

variable "dns_domain" {
  type = string
}

variable "es_logs_instance_count" {
  type = string
  default = "1"
}
