
variable "handler_file" {
  type = string
}

variable "lambda_name" {
  type = string
}

variable "role" {
  type = string
}

variable "environment" {
  type = any
}

variable "handler_method" {
  type = string
}

variable "timeout" {
  type    = string
  default = "29"
}

variable "publish" {
  type    = bool
  default = false
}

variable "memory_size" {
  type    = string
  default = "3008"
}

variable "layers" {
  type        = list(string)
  default     = null
  description = "list of arns for lambda layers"
}

variable "use_source_maps" {
  type = bool
  default = true
}

variable "ephemeral_storage" {
  type        = number
  default     = null
  description = "Size (MB) of /tmp ephemeral storage. Null leaves AWS default (512). Used by api_async_lambda to hold large PDFs for qpdf."
}
