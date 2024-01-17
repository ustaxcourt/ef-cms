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

resource "opensearch_snapshot_repository" "archived-logs" {
  name = "archived-logs"
  type = "s3"
  settings = {
    bucket   = "${var.log_snapshot_bucket_name}"
    region   = "us-east-1"
    role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/es-s3-snapshot-access"
    # role_arn = aws_iam_role.es_s3_snapshot_access_role.arn
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
  sns_topic                    = aws_sns_topic.system_health_alarms.arn
}
