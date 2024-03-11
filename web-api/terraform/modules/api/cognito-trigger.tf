
data "aws_caller_identity" "current" {}

module "cognito_post_confirmation_lambda" {
  source         = "./lambda"
  handler        = "./web-api/terraform/template/lambdas/cognito-triggers.ts"
  handler_method = "handler"
  lambda_name    = "cognito_post_confirmation_lambda_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_post_confirmation_lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}

module "cognito_post_authentication_lambda" {
  source         = "./lambda"
  handler        = "./web-api/terraform/template/lambdas/cognito-triggers.ts"
  handler_method = "handler"
  lambda_name    = "cognito_post_authentication_lambda_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_post_authentication_lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}

module "update_petitioner_cases_lambda" {
  source         = "./lambda"
  handler        = "./web-api/terraform/template/lambdas/cognito-triggers.ts"
  handler_method = "updatePetitionerCasesLambda"
  lambda_name    = "update_petitioner_cases_lambda_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_update_petitioner_cases_lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "29"
  memory_size    = "3008"
}


resource "aws_sqs_queue" "update_petitioner_cases_queue" {
  name = "update_petitioner_cases_queue_${var.environment}_${var.current_color}"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.update_petitioner_cases_dl_queue[0].arn
    maxReceiveCount     = 1
  })
  count            = var.create_triggers
}

resource "aws_lambda_event_source_mapping" "update_petitioner_cases_mapping" {
  event_source_arn = aws_sqs_queue.update_petitioner_cases_queue[0].arn
  function_name    = module.update_petitioner_cases_lambda[0].arn
  batch_size       = 1
  count            = var.create_triggers
}

resource "aws_sqs_queue" "update_petitioner_cases_dl_queue" {
  count            = var.create_triggers
  name = "update_petitioner_cases_dl_queue_${var.environment}_${var.current_color}"
}


resource "aws_lambda_permission" "allow_post_auth_trigger" {
  statement_id  = "AllowPostAuthenticationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.cognito_post_authentication_lambda[0].function_name
  principal     = "cognito-idp.amazonaws.com"
  count         = var.create_triggers
  source_arn    = var.pool_arn
}

resource "aws_lambda_permission" "allow_trigger" {
  statement_id  = "AllowPostConfirmationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.cognito_post_confirmation_lambda[0].function_name
  principal     = "cognito-idp.amazonaws.com"
  count         = var.create_triggers
  source_arn    = var.pool_arn
}