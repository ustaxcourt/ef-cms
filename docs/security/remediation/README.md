# Security Findings Remediation

How the DAWSON team handles security findings, from the moment a scanner or a person reports one
until it is fixed, suppressed or accepted.

| Doc | Use it for |
| --- | --- |
| [Remediation playbook](playbook.md) | The rules: where findings are tracked, roles, exposure tiers, the severity rubric, SLAs, and how to choose an action. Agreed by the team; changes rarely. |
| [Branching and baseline strategy](branching-and-baseline-strategy.md) | How PR checks decide what is new, the `staging` baseline and how it is kept from growing, emergency fixes, and how a suppression is committed so later PRs stay quiet. |
| [Weekly triage](weekly-triage.md) | The Monday checklist and commands, which Security-tab categories to triage, the weekly report, and the backlog clean-up. |
| [Scanner reference](scanner-reference.md) | What each scanner reports and where, how to suppress a finding in each one, how a fix reaches each image, and known errors in the other security docs. |

How each scanner is set up is covered in the scanner docs one level up, in `docs/security/`.
