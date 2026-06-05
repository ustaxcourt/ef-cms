// Background worker that generates the printable docket record for the
// public UI. Invoked only via the Lambda SDK (from the public "start"
// lambda) so it has no API Gateway wiring and no custom authorizer; the
// 29-second gateway timeout does not apply. Result is written to the
// temp-documents S3 bucket under a deterministic key the public polling
// lambda can look up.
module "public_async_docket_record_pdf_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/public-api/generatePublicDocketRecordPdfWorkerLambda.ts"
  handler_method = "generatePublicDocketRecordPdfWorkerLambda"
  lambda_name    = "public_async_docket_record_pdf_${var.environment}_${var.current_color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "3008"
}

// Disable Lambda's default async-invocation retry (2 attempts). A retry of
// a large docket-record generation wastes resources and risks double-billing
// the S3 write; a failure is already surfaced via the ".error" marker object.
resource "aws_lambda_function_event_invoke_config" "public_async_docket_record_pdf_no_retry" {
  function_name          = module.public_async_docket_record_pdf_lambda.function_name
  maximum_retry_attempts = 0
}
