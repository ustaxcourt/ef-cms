resource "null_resource" "local_script_example" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "bash ${path.module}/../../../../bundle-lambda.sh ${var.handler} ${var.file_name}"
  }
}

data "archive_file" "lambda_function_zip" {  
  depends_on = [null_resource.local_script_example]
  type        = "zip"
  source_dir  = "${path.module}/../../../../dist-lambdas/${var.file_name}"
  output_path = "${path.module}/../../../../dist-lambdas/${var.file_name}/${var.file_name}.zip"
}

# Define theAWS Lambda function
resource "aws_lambda_function" "lambda_function" {
  function_name    = var.function_name
  handler          = "${var.file_name}.handler"
  runtime          = "nodejs18.x"
  role             = var.role
  filename         = data.archive_file.lambda_function_zip.output_path
  source_code_hash = data.archive_file.lambda_function_zip.output_base64sha256
  timeout          = "29"
  memory_size      = "3008"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = var.environment
  }
}