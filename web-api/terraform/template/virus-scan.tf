data "archive_file" "virus_scan_zip" {
  type        = "zip"
  output_path = "${path.module}/lambdas/virus-scan.js.zip"
  source_file = "${path.module}/lambdas/dist/virus-scan.js"
}

resource "aws_lambda_function" "virus_scan_lambda" {
  filename         = data.archive_file.virus_scan_zip.output_path
  function_name    = "virus_scan_lambda_${var.environment}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/virus_scan_role_${var.environment}"
  handler          = "virus-scan.handler"
  source_code_hash = data.archive_file.virus_scan_zip.output_base64sha256

  runtime     = "nodejs14.x"
  timeout     = "900"
  memory_size = "768"

  environment {
    variables = {
      ENVIRONMENT          = var.environment
      NODE_ENV             = "production"
      VIRUS_SCAN_QUEUE_URL = aws_sqs_queue.virus_scan_queue.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "virus_scan_mapping" {
  event_source_arn = aws_sqs_queue.virus_scan_queue.arn
  function_name    = aws_lambda_function.virus_scan_lambda.arn
  batch_size       = 1
}
