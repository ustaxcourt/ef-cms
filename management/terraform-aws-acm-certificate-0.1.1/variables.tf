variable "certificate_name" {
  description = "Name of the ACM certificate."
  type        = "string"
}

variable "product_domain" {
  description = "Abbreviation of the product domain this ACM certificate belongs to."
  type        = "string"
}

variable "environment" {
  description = "Environment this ACM certificate belongs to."
  type        = "string"
}

variable "description" {
  description = "Free form description of this ACM certificate."
  type        = "string"
}

variable "domain_name" {
  description = "Domain name the certificate is issued for."
  type        = "string"
}

variable "validation_method" {
  description = "Certificate validation method. Possible values: DNS, EMAIL."
  type        = "string"
}

variable "hosted_zone_name" {
  description = "Need for DNS validation, hosted zone name where record validation will be stored."
  type        = "string"
}

variable "is_hosted_zone_private" {
  description = "Define whether a hosted zone is private or public. Certificate validation using DNS only works for public hosted zone."
  type        = "string"
}
