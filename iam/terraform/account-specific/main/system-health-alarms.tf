// Target for system health notifications; subscriptions are manually managed.
resource "aws_sns_topic" "system_health_alarms" {
  name = "system_health_alarms"
}
