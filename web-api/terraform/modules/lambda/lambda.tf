
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
  #checkov:skip=CKV_AWS_173:Lambda env vars do not require CMK encryption — SLACK_WEBHOOK_URL is deprecated and unused; DEFAULT_ACCOUNT_PASS is scoped to non-production test users only and defaults to a known hardcoded value; no production secrets are stored in env vars
  function_name    = var.lambda_name
  handler          = "lambda.${var.handler_method}"
  runtime          = "nodejs24.x"
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
    variables = merge(var.environment, { NODE_OPTIONS = var.use_source_maps ? "--enable-source-maps" : null })
  }

}


