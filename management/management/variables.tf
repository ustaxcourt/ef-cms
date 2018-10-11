variable "aws_region" {
  type    = "string"
  default = "us-east-1"
}

variable "environment" {}

variable "deployment" {}

variable "dns_domain" {
  default = "mgmt.example.com"
}
 variable "ssh_cidrs" {
  default =  [ ]
}