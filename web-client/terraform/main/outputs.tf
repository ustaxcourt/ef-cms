output "bucket" {
  value       = "${module.environment.bucket}"
  description = "The bucket hosting the built ui src."
}
