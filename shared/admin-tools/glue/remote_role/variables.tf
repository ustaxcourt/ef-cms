variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "remote_account_number" {
  type = string
  description = "The trusted AWS account"
}
