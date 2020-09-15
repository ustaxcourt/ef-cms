# module "iam_main" {
#   source = "../../../iam/terraform/account-specific/main"
#   dns_domain = var.dns_domain
# }

resource "aws_cloudwatch_log_group" "elasticsearch_application_logs" {
  name = "/aws/aes/debug_${var.environment}"
}

# resource "aws_cloudwatch_log_group" "elasticsearch_kibana_logs" {
#   name = "/aws/aes/kibana_${var.environment}"
# }

# resource "aws_cloudwatch_log_resource_policy" "allow_elasticsearch_to_write_logs" {
#   policy_name = "allow_elasticsearch_to_write_logs"

#   policy_document = <<CONFIG
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "es.amazonaws.com"
#       },
#       "Action": [
#         "logs:PutLogEvents",
#         "logs:PutLogEventsBatch",
#         "logs:CreateLogStream"
#       ],
#       "Resource": "arn:aws:logs:*"
#     }
#   ]
# }
# CONFIG
# }

resource "aws_elasticsearch_domain" "efcms-search" {
  domain_name           = "efcms-search-${var.environment}"
  elasticsearch_version = "7.4"

  cluster_config {
    instance_type = "t2.small.elasticsearch"
    instance_count = var.es_instance_count == "" ? "1" : var.es_instance_count
  }

  ebs_options{
    ebs_enabled = true
    volume_size = 10
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_application_logs.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }
}

# resource "aws_elasticsearch_domain" "efcms-logs" {
#   domain_name           = "efcms-info-${var.environment}"
#   elasticsearch_version = "7.4"

#   cluster_config {
#     instance_type = "t2.small.elasticsearch"
#     instance_count = var.es_logs_instance_count
#   }

#   cognito_options {
#     enabled = true
#     user_pool_id = module.iam_main.log_viewers_user_pool_id
#     identity_pool_id = module.iam_main.log_viewers_identity_pool_id
#     role_arn = module.iam_main.es_kibana_role_arn
#   }

#   ebs_options{
#     ebs_enabled = true
#     volume_size = 10
#   }

#   snapshot_options {
#     automated_snapshot_start_hour = 23
#   }

#   log_publishing_options {
#     cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_kibana_logs.arn
#     log_type                 = "ES_APPLICATION_LOGS"
#   }
# }

# data "aws_iam_policy_document" "log_viewers_auth" {
#   statement {
#     actions = [
#       "es:*",
#       "iam:GetRole",
#       "iam:PassRole",
#       "iam:CreateRole",
#       "iam:AttachRolePolicy",
#       "ec2:DescribeVpcs",
#       "cognito-identity:ListIdentityPools",
#       "cognito-idp:ListUserPools"
#     ]

#     principals {
#       type = "AWS"
#       identifiers = [aws_iam_role.log_viewers_auth.arn]
#     }

#     resources = [aws_elasticsearch_domain.efcms-logs.arn]
#   }
# }

# resource "aws_iam_role" "log_viewers_auth" {
#   name = "log_viewers_auth_role"
#   assume_role_policy = <<CONFIG
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Federated": "cognito-identity.amazonaws.com"
#       },
#       "Action": "sts:AssumeRoleWithWebIdentity",
#       "Condition": {
#         "StringEquals": {
#           "cognito-identity.amazonaws.com:aud": "${module.iam_main.log_viewers_identity_pool_id}"
#         },
#         "ForAnyValue:StringLike": {
#           "cognito-identity.amazonaws.com:amr": "authenticated"
#         }
#       }
#     }
#   ]
# }
# CONFIG
# }

# resource "aws_iam_policy" "log_viewers_auth" {
#   name   = "log_viewers_auth_policy"
#   path   = "/"
#   policy = data.aws_iam_policy_document.log_viewers_auth.json
# }

# resource "aws_iam_role_policy_attachment" "log_viewers_auth" {
#   role = aws_iam_role.log_viewers_auth.name
#   policy_arn = aws_iam_policy.log_viewers_auth.arn
# }

# TODO: delete when sure this isn't needed
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "AWS": [
#         "arn:aws:iam::xxxxxx:role/Cognito_xxxxx_es_id_poolAuth_Role"
#         ]
#       },
#       "Action": "es:*",
#       "Resource": "arn:aws:es:ap-south-1:xxxxxx:domain/dev-k8s-es/*"
#     }
#   ]
# }

# resource "aws_iam_role" "log_viewers_unauth" {
#   name = "log_viewers_unauth_role"
#   assume_role_policy = 
# }

# resource "aws_cognito_identity_pool_roles_attachment" "log_viewers" {
#   identity_pool_id = module.iam_main.log_viewers_identity_pool_id
#   roles = {
#     "authenticated" = aws_iam_role.log_viewers_auth.arn
#   }
# }
