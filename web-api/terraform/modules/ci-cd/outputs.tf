output "github_image_scan_role_arn" {
  value = one(aws_iam_role.github_actions_image_scan[*].arn)
}
