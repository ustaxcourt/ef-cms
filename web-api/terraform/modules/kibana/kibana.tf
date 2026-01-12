resource "aws_cognito_user_pool" "log_viewers" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  name  = "log_viewers"
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }
}

resource "aws_cognito_user_pool_domain" "log_viewers" {
  count        = var.es_logs_instance_count > 0 ? 1 : 0
  domain       = "ef-cms-info-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.log_viewers[0].id
}

resource "aws_cognito_identity_pool" "log_viewers" {
  count                            = var.es_logs_instance_count > 0 ? 1 : 0
  identity_pool_name               = "kibana dashboard identity pool"
  allow_unauthenticated_identities = false

  lifecycle {
    ignore_changes = [
      cognito_identity_providers # AWS Elasticsearch forces management itself
    ]
  }
}

resource "aws_iam_role" "es_kibana_role" {
  count              = var.es_logs_instance_count > 0 ? 1 : 0
  name               = "es_kibana_role"
  assume_role_policy = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
CONFIG
}

resource "aws_iam_role_policy_attachment" "es_cognito_auth" {
  count      = var.es_logs_instance_count > 0 ? 1 : 0
  role       = aws_iam_role.es_kibana_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonOpenSearchServiceCognitoAccess"
}

resource "aws_cloudwatch_log_group" "elasticsearch_kibana_logs" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  name  = "/aws/aes/kibana"
}

resource "aws_opensearch_domain" "efcms-logs" {
  count          = var.es_logs_instance_count > 0 ? 1 : 0
  domain_name    = "info"
  engine_version = var.es_logs_engine_version

  cluster_config {
    instance_type  = var.es_logs_instance_type
    instance_count = var.es_logs_instance_count
  }

  cognito_options {
    enabled          = true
    user_pool_id     = aws_cognito_user_pool.log_viewers[0].id
    identity_pool_id = aws_cognito_identity_pool.log_viewers[0].id
    role_arn         = aws_iam_role.es_kibana_role[0].arn
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.es_logs_ebs_volume_size_gb
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_kibana_logs[0].arn
    log_type                 = "ES_APPLICATION_LOGS"
  }
}

resource "aws_opensearch_domain_policy" "kibana_access" {
  count           = var.es_logs_instance_count > 0 ? 1 : 0
  domain_name     = aws_opensearch_domain.efcms-logs[0].domain_name
  access_policies = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Principal": {
        "AWS": ["${aws_iam_role.log_viewers_auth[0].arn}"]
      },
      "Action": "es:ESHttp*",
      "Resource":"${aws_opensearch_domain.efcms-logs[0].arn}/*"
    }, {
      "Effect":"Allow",
      "Principal": {
        "AWS": ${jsonencode(local.all_lambda_arns)}
      },
      "Action": "es:ESHttp*",
      "Resource":"${aws_opensearch_domain.efcms-logs[0].arn}/*"
    }
  ]
}
POLICY
}

resource "aws_cloudwatch_log_resource_policy" "allow_elasticsearch_to_write_logs" {
  count       = var.es_logs_instance_count > 0 ? 1 : 0
  policy_name = "allow_elasticsearch_to_write_logs"

  policy_document = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
CONFIG
}

data "aws_iam_policy_document" "log_viewers_auth" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  statement {
    actions = [
      "es:*",
      "iam:GetRole",
      "iam:PassRole",
      "iam:CreateRole",
      "iam:AttachRolePolicy",
      "ec2:DescribeVpcs",
      "cognito-identity:ListIdentityPools",
      "cognito-idp:ListUserPools",
      "es:ESHttpGet"
    ]

    resources = ["${aws_opensearch_domain.efcms-logs[0].arn}/*"]
  }
}

resource "aws_iam_role" "log_viewers_auth" {
  count              = var.es_logs_instance_count > 0 ? 1 : 0
  name               = "log_viewers_auth_role"
  assume_role_policy = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.log_viewers[0].id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
CONFIG
}

resource "aws_iam_policy" "log_viewers_auth" {
  count  = var.es_logs_instance_count > 0 ? 1 : 0
  name   = "log_viewers_auth_policy"
  path   = "/"
  policy = data.aws_iam_policy_document.log_viewers_auth[0].json
}

resource "aws_iam_role_policy_attachment" "log_viewers_auth" {
  count      = var.es_logs_instance_count > 0 ? 1 : 0
  role       = aws_iam_role.log_viewers_auth[0].name
  policy_arn = aws_iam_policy.log_viewers_auth[0].arn
}

resource "aws_cognito_identity_pool_roles_attachment" "log_viewers" {
  count            = var.es_logs_instance_count > 0 ? 1 : 0
  identity_pool_id = aws_cognito_identity_pool.log_viewers[0].id
  roles = {
    "authenticated" = aws_iam_role.log_viewers_auth[0].arn
  }
}

locals {
  instance_size_in_mb = var.es_logs_instance_count > 0 ? aws_opensearch_domain.efcms-logs[0].ebs_options[0].volume_size * 1000 : 0

  info_cluster_primary_arn = var.es_logs_instance_count > 0 ? "${aws_opensearch_domain.efcms-logs[0].arn}/*" : "${var.es_logs_cluster_arn}/*"

  logs_to_es_count = var.es_logs_instance_count > 0 ? 1 : ((length(var.es_logs_cluster_arn) > 0 && length(var.es_logs_endpoint) > 0) ? 1 : 0)

  info_cluster_consumer_lambda_arns = [
    for account_id in var.es_logs_consumer_account_ids :
    "arn:aws:iam::${account_id}:role/lambda_elasticsearch_execution_role"
  ]
  all_lambda_arns = local.logs_to_es_count > 0 ? concat(
    [aws_iam_role.lambda_elasticsearch_execution_role[0].arn],
    local.info_cluster_consumer_lambda_arns
  ) : local.info_cluster_consumer_lambda_arns
}

module "logs_alarms" {
  count                        = var.es_logs_instance_count > 0 ? 1 : 0
  source                       = "github.com/dubiety/terraform-aws-elasticsearch-cloudwatch-sns-alarms.git?ref=v1.0.4"
  domain_name                  = aws_opensearch_domain.efcms-logs[0].domain_name
  alarm_name_prefix            = "${aws_opensearch_domain.efcms-logs[0].domain_name}: "
  free_storage_space_threshold = local.instance_size_in_mb * 0.25
  create_sns_topic             = false
  sns_topic                    = var.sns_alarm_arn
}

resource "aws_iam_role" "lambda_elasticsearch_execution_role" {
  count              = local.logs_to_es_count
  name               = "lambda_elasticsearch_execution_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_elasticsearch_execution_policy" {
  count  = local.logs_to_es_count
  name   = "lambda_elasticsearch_execution_policy"
  role   = aws_iam_role.lambda_elasticsearch_execution_role[0].id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "es:*"
      ],
      "Resource": [
        "${local.info_cluster_primary_arn}"
      ]
    }
  ]
}
EOF
}

module "logs_to_es" {
  count          = local.logs_to_es_count
  source         = "../lambda"
  handler_file   = "./aws/lambdas/LogsToElasticSearch_info/index.js"
  handler_method = "handler"
  lambda_name    = "LogsToElasticSearch_info"
  role           = aws_iam_role.lambda_elasticsearch_execution_role[0].arn
  environment = {
    es_endpoint = var.es_logs_instance_count > 0 ? aws_opensearch_domain.efcms-logs[0].endpoint : var.es_logs_endpoint
  }
  timeout     = "900"
  memory_size = "3008"
}

resource "aws_cloudwatch_log_group" "logs_to_elasticsearch" {
  count             = local.logs_to_es_count
  name              = "/aws/lambda/${module.logs_to_es[0].function_name}"
  retention_in_days = 14
}

resource "terraform_data" "logs_to_es_last_modified" {
  count = local.logs_to_es_count
  input = module.logs_to_es[0].last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  count         = local.logs_to_es_count
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.logs_to_es[0].function_name
  principal     = "logs.amazonaws.com"
  lifecycle {
    replace_triggered_by = [
      terraform_data.logs_to_es_last_modified
    ]
  }
}

module "regional-log-subscription-filters-east" {
  count                            = local.logs_to_es_count
  source                           = "../regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = module.logs_to_es[0].arn

  depends_on = [aws_lambda_permission.allow_cloudwatch]
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count           = local.logs_to_es_count > 0 ? length(var.log_group_environments) : 0
  destination_arn = module.logs_to_es[0].arn
  filter_pattern  = ""
  name            = "cognito_authorizer_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/cognito_authorizer_lambda_${element(var.log_group_environments, count.index)}"
  depends_on      = [aws_lambda_permission.allow_cloudwatch]
}
