variable "source_table" {
  type    = string
}

variable "destination_table" {
  type  = string
}

variable "external_role_arn" {
  type = string
}

variable "number_of_workers" {
  type = number
  default =  20
}
