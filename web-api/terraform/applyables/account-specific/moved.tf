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
  to   = module.ci-cd-permissions.aws_iam_user.ci_cd
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_policy_attachment
  to   = module.ci-cd-permissions.aws_iam_user_policy_attachment.ci_cd_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_policy
  to   = module.ci-cd-permissions.aws_iam_policy.ci_cd_policy
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_route53_policy_attachment
  to   = module.ci-cd-permissions.aws_iam_user_policy_attachment.ci_cd_route53_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_route53_policy
  to   = module.ci-cd-permissions.aws_iam_policy.ci_cd_route53_policy
}
moved {
  from = aws_iam_user_policy_attachment.circle_ci_iam_policy_attachment
  to   = module.ci-cd-permissions.aws_iam_user_policy_attachment.ci_cd_iam_policy_attachment
}
moved {
  from = aws_iam_policy.circle_ci_iam_policy
  to   = module.ci-cd-permissions.aws_iam_policy.ci_cd_iam_policy
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

