# This file exists to allow us to refactor account-specific to modules.
# This file can be deleted once account-specific deploy has been run on every account.

# Health alarms
moved {
  from = aws_sns_topic.system_health_alarms
  to   = module.health-alarms-east.aws_sns_topic.system_health_alarms
}
moved {
  from = aws_sns_topic.system_health_alarms_west
  to   = module.health-alarms-west.aws_sns_topic.system_health_alarms
}

# api-gateway-cloudwatch.tf
moved {
  from = aws_iam_role.cloudwatch
  to   = module.api-gateway-global-logging-permissions.aws_iam_role.cloudwatch
}
moved {
  from = aws_iam_role_policy.cloudwatch
  to   = module.api-gateway-global-logging-permissions.aws_iam_role_policy.cloudwatch
}

# circle-ci.tf
moved {
  from = aws_iam_user.circle_ci
  to   = module.ci-cd.aws_iam_user.ci_cd
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_policy_attachment
  to   = module.ci-cd.aws_iam_user_policy_attachment.ci_cd_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_policy
  to   = module.ci-cd.aws_iam_policy.ci_cd_policy
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_route53_policy_attachment
  to   = module.ci-cd.aws_iam_user_policy_attachment.ci_cd_route53_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_route53_policy
  to   = module.ci-cd.aws_iam_policy.ci_cd_route53_policy
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_iam_policy_attachment
  to   = module.ci-cd.aws_iam_user_policy_attachment.ci_cd_iam_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_iam_policy
  to   = module.ci-cd.aws_iam_policy.ci_cd_iam_policy
}

# cognito.tf
moved {
  from = aws_cognito_user_pool.log_viewers
  to   = module.kibana.aws_cognito_user_pool.log_viewers
}
moved {
  from = aws_cognito_user_pool_domain.log_viewers
  to   = module.kibana.aws_cognito_user_pool_domain.log_viewers
}
moved {
  from = aws_cognito_identity_pool.log_viewers
  to   = module.kibana.aws_cognito_identity_pool.log_viewers
}
moved {
  from = aws_iam_role.es_kibana_role
  to   = module.kibana.aws_iam_role.es_kibana_role
}
moved {
  from = aws_iam_role_policy_attachment.es_cognito_auth
  to   = module.kibana.aws_iam_role_policy_attachment.es_cognito_auth
}

# dawson-dev.tf
moved {
  from = aws_iam_role.dawson_dev
  to   = module.dawson-developer-permissions.aws_iam_role.dawson_dev
}
moved {
  from = aws_iam_role_policy_attachment.dawson_dev_policy_attachment
  to   = module.dawson-developer-permissions.aws_iam_role_policy_attachment.dawson_dev_policy_attachment
}
moved {
  from = aws_iam_policy.dawson_dev_policy
  to   = module.dawson-developer-permissions.aws_iam_policy.dawson_dev_policy
}

# dynamsoft.tf
moved {
  from = aws_s3_bucket.dynamsoft
  to   = module.dynamsoft.aws_s3_bucket.dynamsoft
}
moved {
  from = aws_s3_bucket_public_access_block.dynamsoft
  to   = module.dynamsoft.aws_s3_bucket_public_access_block.dynamsoft
}
moved {
  from = aws_iam_role.dynamsoft_s3_download_role
  to   = module.dynamsoft.aws_iam_role.dynamsoft_s3_download_role
}
moved {
  from = aws_iam_policy.access_dynamsoft_s3_bucket
  to   = module.dynamsoft.aws_iam_policy.access_dynamsoft_s3_bucket
}
moved {
  from = aws_iam_role_policy_attachment.allow_dynamsoft_role_access_to_dynamsoft_s3_bucket
  to   = module.dynamsoft.aws_iam_role_policy_attachment.allow_dynamsoft_role_access_to_dynamsoft_s3_bucket
}
moved {
  from = aws_iam_instance_profile.dynamsoft_instance_profile
  to   = module.dynamsoft.aws_iam_instance_profile.dynamsoft_instance_profile
}

# ecr.tf
moved {
  from = aws_ecr_repository.image_repository
  to   = module.ci-cd.aws_ecr_repository.image_repository
}
moved {
  from = aws_ecr_lifecycle_policy.repo_policy
  to   = module.ci-cd.aws_ecr_lifecycle_policy.repo_policy
}

# elasticsearch.tf
moved {
  from = aws_cloudwatch_log_group.elasticsearch_kibana_logs
  to   = module.kibana.aws_cloudwatch_log_group.elasticsearch_kibana_logs
}
moved {
  from = aws_opensearch_domain.efcms-logs
  to   = module.kibana.aws_opensearch_domain.efcms-logs
}
moved {
  from = aws_elasticsearch_domain_policy.kibana_access
  to   = module.kibana.aws_elasticsearch_domain_policy.kibana_access
}
moved {
  from = aws_cloudwatch_log_resource_policy.allow_elasticsearch_to_write_logs
  to   = module.kibana.aws_cloudwatch_log_resource_policy.allow_elasticsearch_to_write_logs
}
moved {
  from = aws_iam_role.log_viewers_auth
  to   = module.kibana.aws_iam_role.log_viewers_auth
}
moved {
  from = aws_iam_policy.log_viewers_auth
  to   = module.kibana.aws_iam_policy.log_viewers_auth
}
moved {
  from = aws_iam_role_policy_attachment.log_viewers_auth
  to   = module.kibana.aws_iam_role_policy_attachment.log_viewers_auth
}
moved {
  from = aws_cognito_identity_pool_roles_attachment.log_viewers
  to   = module.kibana.aws_cognito_identity_pool_roles_attachment.log_viewers
}
# moved {
#   from = opensearch_snapshot_repository.archived-logs
#   to   = module.kibana.opensearch_snapshot_repository.archived-logs
# }
moved {
  from = module.logs_alarms
  to   = module.kibana.module.logs_alarms
}

#lambda-edge-role.tf
moved {
  from = aws_iam_service_linked_role.lambda_replication_role
  to   = module.edge-lambda-permissions.aws_iam_service_linked_role.lambda_replication_role
}
moved {
  from = aws_iam_service_linked_role.lambda_cloudfront_logger_role
  to   = module.edge-lambda-permissions.aws_iam_service_linked_role.lambda_cloudfront_logger_role
}
