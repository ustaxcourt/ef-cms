output "bucket" {
  value       = module.environment.bucket
  description = "The bucket hosting the built ui src."
}

output "bucket_public" {
  value       = module.environment.bucket_public
  description = "The bucket hosting the built public ui src."
}
