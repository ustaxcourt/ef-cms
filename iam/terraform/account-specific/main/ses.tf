resource "aws_ses_receipt_rule_set" "email_forwarding_rule_set" {
  rule_set_name = "email_forwarding_rule_set"
}

resource "aws_ses_active_receipt_rule_set" "main" {
  rule_set_name = aws_ses_receipt_rule_set.email_forwarding_rule_set.rule_set_name
}
