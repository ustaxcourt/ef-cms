resource "aws_lambda_function" "worker_lambda" {
  function_name    = "worker_lambda_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_update_petitioner_cases_lambda_role_${var.environment}"
  handler          = "worker-handler.workerHandler"
  timeout          = "900"
  memory_size      = "3008"
  runtime          = var.node_version
  depends_on       = [var.worker_object] # 10007 come back
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "worker_${var.current_color}.js.zip" # 10007 come back
  source_code_hash = var.worker_object_hash #10007 come back

  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}
