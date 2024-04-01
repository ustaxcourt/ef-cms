
output "invoke_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}

output "function_name" {
  value = aws_lambda_function.lambda_function.function_name
}

output "arn" {
  value = aws_lambda_function.lambda_function.arn
}

output "qualified_arn" {
  value = aws_lambda_function.lambda_function.qualified_arn
}

output "lambda_function" {
  value = aws_lambda_function.lambda_function
}
