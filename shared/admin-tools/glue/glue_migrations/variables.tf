variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_table" {
  type        = string
  description = "The name of the DynamoDB table that will be read from and exported."
}

variable "destination_table" {
  type        = string
  description = "The name of the DynamoDB table into which transformed rows will be written."
}

variable "external_role_arn" {
  type        = string
  description = "The ARN of the role in external account with write permissions and a trust relationship with this account."
}

variable "number_of_workers" {
  type        = number
  default     =  20
  description = "Number of Data Processing Units to use for this job."
}
