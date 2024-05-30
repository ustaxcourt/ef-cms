resource "aws_cognito_user_pool" "log_viewers" {
  name = "log_viewers"
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
  domain       = "ef-cms-info-${var.cognito_suffix}"
  user_pool_id = aws_cognito_user_pool.log_viewers.id
}

resource "aws_cognito_identity_pool" "log_viewers" {
  identity_pool_name               = "kibana dashboard identity pool"
  allow_unauthenticated_identities = false

  lifecycle {
    ignore_changes = [
      cognito_identity_providers # AWS Elasticsearch forces management itself
    ]
  }
}

resource "aws_iam_role" "es_kibana_role" {
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
  role       = aws_iam_role.es_kibana_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonOpenSearchServiceCognitoAccess"
}

resource "aws_cloudwatch_log_group" "elasticsearch_kibana_logs" {
  name = "/aws/aes/kibana"
}

resource "aws_opensearch_domain" "efcms-logs" {
  domain_name           = "info"
  engine_version        = "OpenSearch_2.11"

  cluster_config {
    instance_type  = var.es_logs_instance_type
    instance_count = var.es_logs_instance_count
  }

  cognito_options {
    enabled          = true
    user_pool_id     = aws_cognito_user_pool.log_viewers.id
    identity_pool_id = aws_cognito_identity_pool.log_viewers.id
    role_arn         = aws_iam_role.es_kibana_role.arn
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
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_kibana_logs.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }
}

resource "aws_elasticsearch_domain_policy" "kibana_access" {
  domain_name     = aws_opensearch_domain.efcms-logs.domain_name
  access_policies = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Principal": {
        "AWS": ["${aws_iam_role.log_viewers_auth.arn}"]
      },
      "Action": "es:ESHttp*",
      "Resource":"${aws_opensearch_domain.efcms-logs.arn}/*"
    }
  ]
}
POLICY
}

resource "aws_cloudwatch_log_resource_policy" "allow_elasticsearch_to_write_logs" {
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

    resources = ["${aws_opensearch_domain.efcms-logs.arn}/*"]
  }
}

resource "aws_iam_role" "log_viewers_auth" {
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
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.log_viewers.id}"
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
  name   = "log_viewers_auth_policy"
  path   = "/"
  policy = data.aws_iam_policy_document.log_viewers_auth.json
}

resource "aws_iam_role_policy_attachment" "log_viewers_auth" {
  role       = aws_iam_role.log_viewers_auth.name
  policy_arn = aws_iam_policy.log_viewers_auth.arn
}

resource "aws_cognito_identity_pool_roles_attachment" "log_viewers" {
  identity_pool_id = aws_cognito_identity_pool.log_viewers.id
  roles = {
    "authenticated" = aws_iam_role.log_viewers_auth.arn
  }
}

locals {
  instance_size_in_mb = aws_opensearch_domain.efcms-logs.ebs_options[0].volume_size * 1000
}

module "logs_alarms" {
  source                       = "github.com/dubiety/terraform-aws-elasticsearch-cloudwatch-sns-alarms.git?ref=v1.0.4"
  domain_name                  = aws_opensearch_domain.efcms-logs.domain_name
  alarm_name_prefix            = "${aws_opensearch_domain.efcms-logs.domain_name}: "
  free_storage_space_threshold = local.instance_size_in_mb * 0.25
  create_sns_topic             = false
  sns_topic                    = var.sns_alarm_arn
}

resource "aws_iam_role" "lambda_elasticsearch_execution_role" {
  name = "lambda_elasticsearch_execution_role"
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
  name = "lambda_elasticsearch_execution_policy"
  role = aws_iam_role.lambda_elasticsearch_execution_role.id
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
        "${aws_opensearch_domain.efcms-logs.arn}/*"
      ]
    }
  ]
}
EOF
}

module "logs_to_es" {
  source         = "../lambda"
  handler_file   = "./aws/lambdas/LogsToElasticSearch_info/index.js"
  handler_method = "handler"
  lambda_name    = "LogsToElasticSearch_info"
  role           = aws_iam_role.lambda_elasticsearch_execution_role.arn
  environment = {
    es_endpoint = aws_opensearch_domain.efcms-logs.endpoint
  }
  timeout     = "900"
  memory_size = "3008"
}

resource "aws_cloudwatch_log_group" "logs_to_elasticsearch" {
  name              = "/aws/lambda/${module.logs_to_es.function_name}"
  retention_in_days = 14
}

resource "terraform_data" "logs_to_es_last_modified" {
  input = module.logs_to_es.last_modified
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.logs_to_es.function_name
  principal     = "logs.amazonaws.com"
  lifecycle {
    replace_triggered_by = [
      terraform_data.logs_to_es_last_modified
    ]
  }
}


module "regional-log-subscription-filters-east" {
  source                           = "../regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = module.logs_to_es.arn
  
  depends_on = [aws_lambda_permission.allow_cloudwatch]
}

module "regional-log-subscription-filters-west" {
  source                           = "../regional-log-subscription-filters"
  log_group_environments           = var.log_group_environments
  logs_to_elasticsearch_lambda_arn = module.logs_to_es.arn

  providers = {
    aws = aws.us-west-1
  }

  depends_on = [aws_lambda_permission.allow_cloudwatch]
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count           = length(var.log_group_environments)
  destination_arn = module.logs_to_es.arn
  filter_pattern  = ""
  name            = "cognito_authorizer_${element(var.log_group_environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/cognito_authorizer_lambda_${element(var.log_group_environments, count.index)}"
  depends_on      = [aws_lambda_permission.allow_cloudwatch]
}


