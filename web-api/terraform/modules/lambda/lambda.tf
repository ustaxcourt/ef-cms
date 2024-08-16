
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
  runtime          = "nodejs20.x"
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
    variables = var.use_source_maps ? merge(var.environment, { NODE_OPTIONS = "--enable-source-maps" }) : var.environment
  }

  # dynamic "vpc_config" {
  #   for_each = length(var.security_group_ids) > 0 && length(var.subnet_ids) > 0 ? [1] : []

  #   content {
  #     security_group_ids = var.security_group_ids
  #     subnet_ids         = var.subnet_ids
  #   }
  # }
}


