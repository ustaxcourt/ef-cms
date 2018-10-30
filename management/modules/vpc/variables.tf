variable "number_of_subnets" {
  type        = "string"
  default     = 1
  description = "The number of public and private subnets to create in the VPC. For example, \"2\" creates two public and two private subnets."
}

variable "environment" {
  type = "string"
}

variable "deployment" {
  type = "string"
}