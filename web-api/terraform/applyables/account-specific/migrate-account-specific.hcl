migration "state" "test" {
  dir = "."
  actions = [
    "mv aws_sns_topic.system_health_alarms module.health-alarms-east.aws_sns_topic.system_health_alarms",
  ]
}


# tfmigrate plan --backend-config=bucket="ustc-case-mgmt.flexion.us.terraform.deploys" --backend-config=key="permissions-account.tfstate" --backend-config=dynamodb_table="efcms-terraform-lock" --backend-config=region="us-east-1"