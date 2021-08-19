---
name: Offboard a team member
about: Used for employees of the U.S. Tax Court and vendor teams to revoke access to all relevant accounts and tools when an employee departs.
title: Offboard [Person]
---

- [ ] All access is revoked to tools listed in [the onboarding template](.github/ISSUE_TEMPLATE/onboarding.md) (copy the relevant accounts to checklist items below).

Verify the offboarding person:

- [ ] Does not have active AWS IAM accounts in staging and production AWS accounts.
- [ ] Does not have active AWS Organization accounts in staging and production AWS accounts.
- [ ] Does not have Cognito access to Kibana logs in staging and production AWS accounts.
- [ ] Does not have privileged Cognito access to DAWSON environments.
- [ ] Does not have access to private GitHub repositories.
- [ ] Does not have push access to public GitHub repositories.
- [ ] Does not have access to Zendesk.
- [ ] Does not have access to Slack.
- [ ] Does not have access to Trello boards.
- [ ] All sensitive secrets the person had access to are rotated.

