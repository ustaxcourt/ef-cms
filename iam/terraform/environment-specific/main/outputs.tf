
output "post_confirmation_role_arn" {
  value = "${aws_iam_role.iam_cognito_post_confirmation_lambda_role.arn}"
}

output "s3_replication_role_arn" {
  value = "${aws_iam_role.s3_replication_role.arn}"
}

output "lambda_role_arn" {
  value = "${aws_iam_role.lambda_role.arn}"
}