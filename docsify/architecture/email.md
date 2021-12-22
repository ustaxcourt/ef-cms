# Email

All outbound emails are sent by Amazon SES using these domains:

| Item | Description
|------|-------------
| Mail domain | `mail.efcms-{ENV}.{EFCMS_DOMAIN}`
| From domain | `noreply.mail.efcms-{ENV}.{EFCMS_DOMAIN}`

## Security summary

| Item | Description
|------|-------------
| SPF | SPF indicates which servers are authorized to send mail on behalf of a domain. SPF DNS records for EF-CMS use SPF’s `include` and reference Amazon SES’s domain, indicating that SES’s servers are authorized to send email. [Verify SPF DNS records](https://mxtoolbox.com/spf.aspx) for the “From domain” above.
| DKIM | DKIM verifies email was sent from the domain that an email claims it was sent from, by using public/private key encryption to match an email signature to a public key in a DNS record. DKIM records are harder to verify since Amazon SES uses generated keys and host names based on DKIM tokens. Look up these domains [as described in Amazon SES documentation](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-authentication-dkim-easy-managing.html) and then [verify DKIM DNS records](https://mxtoolbox.com/dkim.aspx). They will be in the format of `{DKIM token}._domainkey.{Mail domain}`.
| DMARC | DMARC provides a policy through DNS which indicates what email security mechanisms are in place, what a receiver should do if an email fails those mechanisms, and introduces a mechanism for receivers to notify the sender of security verification failures. [Verify DMARC DNS records](https://mxtoolbox.com/DMARC.aspx) for the “Mail domain” above.
| DNSSEC | DNSSEC proves a DNS name server is authorized to provide answers for a domain by using a chain of signed records from a domain up to the top-level domain (like `.gov`). SPF, DKIM, and DMARC relies on DNS lookups, so DNSSEC enhances trust in these security mechanisms. [Verify DNSSEC DNS records](https://dnssec-analyzer.verisignlabs.com/) for the “Mail domain” above.

### Compliance with NIST 800-177

The system is not [NIST 800-177 Trustworthy Email](https://doi.org/10.6028/NIST.SP.800-177r1) compliant:

- SPF, DKIM, and DMARC are configured, but the DKIM keys are 1024-bit instead of 2048-bit.
- DNSSEC is not supported by Amazon Route53 or the DKIM signing domains used for Amazon SES Easy DKIM.
- EF-CMS does not end-to-end encrypt emails with S/MIME.

| Status | Recommendation
|--------|----------------
| ✅ | 4-1: Organizations are recommended to deploy SPF to specify which IP addresses are authorized to transmit email on behalf of the domain. Domains controlled by an organization that are not used to send email, for example Web only domains, should include an SPF Resource Record (RR) with the policy indicating that there are no valid email senders for the given domain.
| ❌<sup>1</sup> | 4-2: Organizations should deploy DNSSEC for all DNS name servers and validate DNSSEC responses from all systems that receive email.
| ❌<sup>2</sup> | 4-3: Federal agency administrators shall only use keys with approved algorithms and lengths for use with DKIM.
| ✅ | 4-4: Administrators should ensure that the private portion of the key pair is adequately protected on the sending Mail Transfer Agent (MTA) and that only the MTA software has read privileges for the key. Federal agency administrators should follow FISMA control SC-12 [SP800-53] guidance with regards to distributing and protecting DKIM key pairs.
| ✅ | 4-5: Each sending MTA should be configured with its own private key and its own selector value, to minimize the damage that may occur if a private key is compromised.
| ❌<sup>1</sup> | 4-6: Organizations should deploy DNSSEC to provide authentication and integrity protection to the DKIM DNS resource records.
| ❌<sup>3</sup> | 4-7: Organizations should enable DNSSEC validation on DNS servers used by MTAs that verify DKIM signatures.
| N/A | 4-8: Mailing list software should verify DKIM signatures on incoming mail and re-sign outgoing mail with new DKIM signatures.
| N/A | 4-9: Mail sent to broadcast mailing lists from do-not-reply or unmonitored mailboxes should be digitally signed with S/MIME signatures so that recipients can verify the authenticity of the messages.
| ✅ | 4-10: A unique DKIM key pair should be used for each third party that sends email on the organization's behalf.
| ❌<sup>4</sup> | 4-11: Use S/MIME signatures for assuring message authenticity and integrity.

Notes:

1. DNSSEC is not supported by Amazon Route53, and we are sending mail from a subdomain which is controlled by Route53.
2. EF-CMS uses Amazon SES Easy DKIM, [which uses a 1024-bit key](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-authentication-dkim-easy.html).
3. Amazon SES does not support DNSSEC on its Easy DKIM signing domains.
4. Encrypting emails with S/MIME would reduce the effectiveness of email notifications, as some recipients would not be able to decrypt the emails. No sensitive information is sent in email notifications.

### Verifying SES Email

At present this is a manual process as a human needs to click on the link in the email in order to verify ownership. We verify ownership so that we can use that verified email's ARN in [our Cognito configuration](../../web-api/terraform/template/cognito.tf). This lets us send more email than Cognito's very low quotas allow. 

Here are the steps required to verify a new email:


#### Automated

1. Set the environment variables:
  - `EFCMS_DOMAIN` e.g. `exp2.ustc-case-mgmt.flexion.us`
  - `REGION` e.g. `us-east-1`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_ACCOUNT_ID`
  - `AWS_SECRET_ACCESS_KEY`
2. Run the script:
  - `cd web-api && ./verify-ses-email.sh`

#### Manual
1. Need to create an s3 bucket (e.g. `mail-verification.example.com`)
2. Need to grant SES permission to write to it. Replace `BUCKET-NAME` and `AWSACCCOUNTID` in the following policy, and apply it to the newly created bucket:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowSESPuts",
                "Effect": "Allow",
                "Principal": {
                    "Service": "ses.amazonaws.com"
                },
                "Action": "s3:PutObject",
                "Resource": "arn:aws:s3:::BUCKET-NAME/*",
                "Condition": {
                    "StringEquals": {
                        "aws:Referer": "AWSACCOUNTID"
                    }
                }
            }
        ]
    }
    ```

3. In SES, create a rule set: (e.g., `confirm_email_helper`)
4. Need to create a Rule in that has the following attributes: (Replace `BUCKET-NAME`)

   ```json
   {
      "Name": "Confirm Email Rule",
      "Enabled": true,
      "Actions": [
        {
          "S3Action": {
            "BucketName": "BUCKET-NAME"
          }
        }
      ]
    }
    ```

5. Need to make the Rule Set active
6. Use SES to send a verification email to that account.
7. Check the S3 bucket. It should have an item in there with a link to confirm the Email Address. Follow the link, and the email address should be verified.
8. When complete, delete the S3 Bucket, SES Rule, and SES Rule Set. Future deploys should rely on the verified email.
