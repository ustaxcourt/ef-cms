variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "stream_arn" {
  type = string
}

variable "destination_table" {
  type = string
}

variable "source_table" {
  type = string
}

variable "efcms_domain" {
  type = string
}

variable "s3_endpoint" {
  type = string
}

variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}
