resource "aws_cloudwatch_event_rule" "check_reindex_status_cron_rule" {
  name                = "check_switch_colors_status_cron_${var.environment}"
  schedule_expression = "cron(* 0-3 * * SUN *)"
  is_enabled          = "true"
}