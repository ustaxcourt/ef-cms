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
  to   = module.api_gateway_global_logging_permissions.aws_iam_role.cloudwatch
}
moved {
  from = aws_iam_role_policy.cloudwatch
  to   = module.api_gateway_global_logging_permissions.aws_iam_role_policy.cloudwatch
}
