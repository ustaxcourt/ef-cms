variable "aws_region" {
  type    = "string"
  default = "us-east-1"
}

variable "environment" {}

variable "deployment" {}

variable "dns_domain" {
}
 variable "ssh_cidrs" {
  default =  [ ]
}