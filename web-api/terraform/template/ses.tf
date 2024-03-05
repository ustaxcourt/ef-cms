# Domain Identity, Verification and From
resource "aws_ses_domain_identity" "main" {
  provider = aws.us-east-1
  domain   = var.dns_domain
}

resource "aws_route53_record" "ses_verification_record" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "_amazonses.${aws_ses_domain_identity.main.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.main.verification_token]
}

resource "aws_ses_domain_identity_verification" "example_verification" {
  domain     = aws_ses_domain_identity.main.id
  depends_on = [aws_route53_record.ses_verification_record]
}

resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "from.${aws_ses_domain_identity.main.domain}"
}

resource "aws_ses_email_identity" "ses_sender" {
  email = "noreply@${var.dns_domain}"
}

#
# SES DKIM Verification
#
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "dkim" {
  count   = 3
  zone_id = data.aws_route53_zone.zone.id
  name    = format("%s._domainkey.%s", element(aws_ses_domain_dkim.main.dkim_tokens, count.index), aws_ses_domain_identity.main.domain)
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.main.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

# SPF Validation Record
resource "aws_route53_record" "spf_mail_from" {
  zone_id = data.aws_route53_zone.zone.id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

resource "aws_route53_record" "spf_domain" {
  zone_id = data.aws_route53_zone.zone.id
  name    = aws_ses_domain_identity.main.domain
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

# Sending MX Record
data "aws_region" "current" {}

resource "aws_route53_record" "mx_send_mail_from" {
  zone_id = data.aws_route53_zone.zone.id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${data.aws_region.current.name}.amazonses.com"]
}

# Receiving MX Record
resource "aws_route53_record" "mx_receive" {
  zone_id = data.aws_route53_zone.zone.id
  name    = aws_ses_domain_identity.main.domain
  type    = "MX"
  ttl     = "600"
  records = ["10 inbound-smtp.${data.aws_region.current.name}.amazonaws.com"]
}

#
# DMARC TXT Record
#
resource "aws_route53_record" "txt_dmarc" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "_dmarc.${aws_ses_domain_identity.main.domain}"
  type    = "TXT"
  ttl     = "600"
  records = [var.email_dmarc_policy]
}

# Email Template
resource "aws_ses_template" "document_served" {
  name    = "document_served_${var.environment}"
  subject = "eService Notification from US Tax Court on Case {{docketNumber}}"
  html    = <<EOF
  {{emailContent}}
EOF
}

#Petition Service Email Template
resource "aws_ses_template" "petition_served" {
  name    = "petition_served_${var.environment}"
  subject = "eService Notification from US Tax Court on Case {{docketNumber}}"
  html    = <<EOF
  {{emailContent}}
EOF
}

#Email Change Verification Email Template
resource "aws_ses_template" "email_change_verification" {
  name    = "email_change_verification_${var.environment}"
  subject = "U.S. Tax Court: Verify Your New Email"
  html    = <<EOF
  {{emailContent}}
EOF
}

#IRS Super User Bounce Report Email Template
resource "aws_ses_template" "bounce_alert" {
  name    = "bounce_alert_${var.environment}"
  subject = "ALERT: Email to the IRS Super User has bounced"
  html    = <<EOF
  {{emailContent}}
EOF
}

resource "aws_sns_topic" "bounced_service_emails" {
  name = "bounced_service_emails_${var.environment}"
}

resource "aws_sns_topic_policy" "bounced_service_emails" {
  arn    = aws_sns_topic.bounced_service_emails.arn
  policy = data.aws_iam_policy_document.sns_bounced_service_emails_policy.json
}

data "aws_iam_policy_document" "sns_bounced_service_emails_policy" {
  statement {
    actions = [
      "SNS:Publish",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceAccount"

      values = [
        data.aws_caller_identity.current.account_id,
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"

      values = [
        aws_ses_email_identity.ses_sender.arn
      ]
    }

    effect = "Allow"
    principals {
      type = "Service"
      identifiers = [
        "ses.amazonaws.com"
      ]
    }

    resources = [
      aws_sns_topic.bounced_service_emails.arn,
    ]
  }
}

resource "aws_ses_identity_notification_topic" "bounced_service_emails" {
  topic_arn                = aws_sns_topic.bounced_service_emails.arn
  notification_type        = "Bounce"
  identity                 = aws_ses_email_identity.ses_sender.arn
  include_original_headers = true
}

resource "aws_ses_receipt_rule" "email_forwarding_rule" {
  name          = "email_forwarding_rule_${var.environment}"
  rule_set_name = var.active_ses_ruleset
  # TODO: should smoketest@ be a secret?
  recipients   = ["smoketest@${aws_ses_domain_identity.main.domain}"]
  enabled      = true
  scan_enabled = true
  depends_on   = [aws_s3_bucket_policy.allow_access_for_email_smoketests]
  s3_action {
    bucket_name = aws_s3_bucket.smoketest_email_inbox.bucket
    position    = 1
  }
}
