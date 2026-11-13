variable "github_image_scan_environment" {
  description = "GitHub Environment allowed to assume the image scan role. Null skips creating it."
  type        = string
  default     = null
}

variable "github_repository" {
  description = "GitHub repository, as owner/name, whose workflows may assume the image scan role."
  type        = string
  default     = "ustaxcourt/ef-cms"
}

variable "lower_env_restore_roles" {
  type = set(string)
}
