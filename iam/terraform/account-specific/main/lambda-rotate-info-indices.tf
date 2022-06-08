data "archive_file" "zip_rotate_info_indices_lambda" {
  type        = "zip"
  output_path = "${path.cwd}/../../../../aws/lambdas/RotateInfoIndices.zip"
  source_file = "${path.cwd}/../../../../aws/lambdas/RotateInfoIndices/index.js"
}

resource "aws_lambda_function" "rotate_info_indices" {
  filename      = data.archive_file.zip_rotate_info_indices_lambda.output_path
  function_name = "RotateInfoIndices"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_elasticsearch_execution_role.arn
  runtime       = "nodejs14.x"

  source_code_hash = "${filebase64sha256(data.archive_file.zip_rotate_info_indices_lambda.output_path)}-${aws_iam_role.lambda_elasticsearch_execution_role.name}"

  environment {
    variables = {
      es_endpoint = aws_elasticsearch_domain.efcms-logs.endpoint
    }
  }
}

resource "aws_cloudwatch_log_group" "rotate_info_indices" {
  name              = "/aws/lambda/${aws_lambda_function.rotate_info_indices.function_name}"
  retention_in_days = 14
}
