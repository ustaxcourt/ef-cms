// Target for system health notifications; subscriptions are manually managed.
resource "aws_sns_topic" "system_health_alarms" {
  name = "system_health_alarms"
}

resource "aws_sns_topic" "system_health_alarms_west" {
  name     = "system_health_alarms_west"
  provider = aws.us-west-1
}
