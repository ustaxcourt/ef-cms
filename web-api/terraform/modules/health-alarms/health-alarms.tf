resource "aws_sns_topic" "system_health_alarms" {
  #checkov:skip=CKV_AWS_26: carries operational health alerts only — no PII; CMK encryption adds key management overhead with no security benefit for non-sensitive notifications
  name = "system_health_alarms"
}
