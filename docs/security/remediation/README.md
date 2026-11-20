# Security Findings Remediation

## Scanning paused

Security scanning and the checks that block pull requests are temporarily turned off, as of
YYYY-MM-DD. See [issue #10615](https://github.com/ustaxcourt/ef-cms/issues/10615) (Payment Portal team ticket DAW-32). The scanning process is being reworked
separately, and this section will be removed when scanning is turned back on.

### What is turned off

These workflows are disabled in GitHub Actions. Their files are unchanged.

| Workflow | File |
| --- | --- |
| Security - SAST | `.github/workflows/security-sast.yml` |
| Security - Secrets | `.github/workflows/security-secrets.yml` |
| Security - Supply Chain | `.github/workflows/security-supply-chain.yml` |
| Security - Containers | `.github/workflows/security-containers.yml` |
| Security - DAST | `.github/workflows/security-dast.yml` |
| Security - No New Findings | `.github/workflows/security-compare.yml` |

These rules are removed from the `staging_reviews-gate` ruleset:

- Required status checks `Security Gate (SAST)` and `Security Gate (Secrets)`
- The CodeQL code scanning rule

### What this means

- Pull requests show no `Security - *` checks, and security findings do not block merges.
- No results are uploaded to the Security tab. The code scanning alerts there are frozen as of the
  date above and are out of date, so do not triage them. The [weekly triage](weekly-triage.md) is paused.
- The rest of the security docs describe how scanning works when it is turned on.

### Turning scanning back on

1. A repository admin restores the `staging_reviews-gate` ruleset from the snapshot on [issue #10615](https://github.com/ustaxcourt/ef-cms/issues/10615).
2. Re-enable each workflow above in GitHub Actions, or run `gh workflow enable <file>` for each one.
3. Remove this section and the "Paused" notes at the top of the other security docs.

## Remediation docs

How the DAWSON team handles security findings, from the moment a scanner or a person reports one
until it is fixed, suppressed or accepted.

| Doc | Use it for |
| --- | --- |
| [Remediation playbook](playbook.md) | The rules: where findings are tracked, roles, exposure tiers, the severity rubric, SLAs, and how to choose an action. Agreed by the team; changes rarely. |
| [Branching and baseline strategy](branching-and-baseline-strategy.md) | How PR checks decide what is new, the `staging` baseline and how it is kept from growing, emergency fixes, and how a suppression is committed so later PRs stay quiet. |
| [Weekly triage](weekly-triage.md) | The Monday checklist and commands, which Security-tab categories to triage, the weekly report, and the backlog clean-up. |
| [Scanner reference](scanner-reference.md) | What each scanner reports and where, how to suppress a finding in each one, how a fix reaches each image, and known errors in the other security docs. |

How each scanner is set up is covered in the scanner docs one level up, in `docs/security/`.
