
resource "random_uuid" "bundle_directory" {
}

resource "null_resource" "esbuild_lambda" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "node ${path.module}/esbuildLambda.mjs ${var.handler_file} ${random_uuid.bundle_directory.id}"
  }
}

data "archive_file" "lambda_function_zip" {
  depends_on  = [null_resource.esbuild_lambda]
  type        = "zip"
  source_dir  = "${path.module}/../../../../dist-lambdas/${random_uuid.bundle_directory.id}/out"
  output_path = "${path.module}/../../../../dist-lambdas/${random_uuid.bundle_directory.id}/${random_uuid.bundle_directory.id}.zip"
}

resource "aws_lambda_function" "lambda_function" {
  function_name    = var.lambda_name
  handler          = "lambda.${var.handler_method}"
  runtime          = "nodejs18.x"
  role             = var.role
  filename         = data.archive_file.lambda_function_zip.output_path
  source_code_hash = data.archive_file.lambda_function_zip.output_base64sha256
  timeout          = var.timeout
  memory_size      = var.memory_size
  layers           = var.layers
  publish          = var.publish

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = var.environment
  }
}
