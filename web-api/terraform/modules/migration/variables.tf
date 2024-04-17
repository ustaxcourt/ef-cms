variable "aws_region" {
  type = string
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

variable "documents_bucket_name" {
  type = string
}

variable "elasticsearch_domain" {
  type = string
}
