output "role_arn" {
  value = aws_iam_role.lambda_role.arn
}

output "role_id" {
  value = aws_iam_role.lambda_role.id
}

output "policy_id" {
  value = aws_iam_role_policy.lambda_policy.id
}
