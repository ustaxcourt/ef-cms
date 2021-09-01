# 3. Use Terraform to automate infrastructure provisioning

Date: 2021-07-13

## Status

Accepted

## Context

> The issue motivating this decision, and any context that influences or constrains the decision. **This issue was documented in retrospect.**

As specified in the Court’s [Deliverables and Performance Standards](https://github.com/ustaxcourt/case-management-rfq/blob/master/02_SOW.md#deliverables-and-performance-standards), the project must be deployed, where acceptable quality is defined as deployed with a single command. As interpreted by the team, this requires some form of automation of infrastructure provisioning.

Terraform and Serverless were initially selected to configure AWS. This issue is documented in retrospect, and Serverless was moved away from (which will be documented in a further decision record) — so this issue will focus on Terraform exclusively.

Terraform was deemed the most popular and [recommended](https://engineering.18f.gov/language-selection/) framework for automating infrastructure and storing configuration in code.

## Decision

> The change that we're proposing or have agreed to implement.

We’ll automate provisioning and configuring infrastructure components using Terraform. If any manual steps are needed to upgrade environments from the main code branch to the next version, they will be documented in the pull request proposing the change.

## Consequences

> What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

- Creating new environments is easier because it’s done by executing an automated command instead of a set of steps which must be done manually. Could not imagine delivering the project manually.
- The risk of misconfiguration of an environment decreases.
- Management of Terraform state adds complexity to configuration, but is an acceptable level of complexity due to the automation benefits. Terraform state is version-specific, so upgrading versions of Terraform can be complex to execute.
  - This complexity is mitigated by automatically running Terraform on each deploy, decreasing the chance of Terraform state falling more than one version update behind.
