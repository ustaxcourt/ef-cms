# This file exists to allow us to refactor account-specific to modules

moved {
  from = aws_sns_topic.system_health_alarms
  to   = module.health-alarms-east.aws_sns_topic.system_health_alarms
}

moved {
  from = aws_sns_topic.system_health_alarms_west
  to   = module.health-alarms-west.aws_sns_topic.system_health_alarms
}