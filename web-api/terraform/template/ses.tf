# Domain Identity, Verification and From
resource "aws_ses_domain_identity" "main" {
  provider = "aws.us-east-1"
  domain   = "mail.efcms-${var.environment}.${var.dns_domain}"
}

resource "aws_route53_record" "ses_verification_record" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "_amazonses.${aws_ses_domain_identity.main.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.main.verification_token]
}

resource "aws_ses_domain_identity_verification" "example_verification" {
  domain = aws_ses_domain_identity.main.id

  depends_on = ["aws_route53_record.ses_verification_record"]
}

resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "noreply.${aws_ses_domain_identity.main.domain}"
}

#
# SES DKIM Verification
#
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "dkim" {
  count = 3
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
  records = ["v=DMARC1; p=none; rua=mailto:${var.ses_dmarc_rua};"]
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
