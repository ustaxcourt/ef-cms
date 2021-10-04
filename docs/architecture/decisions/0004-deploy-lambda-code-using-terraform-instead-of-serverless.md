# 4. Deploy lambda code using Terraform instead of Serverless

Date: 2021-07-13

## Status

Accepted

## Context

> The issue motivating this decision, and any context that influences or constrains the decision. **This issue was documented in retrospect.**

Prior to this decision, the Serverless Framework was used to package and deploy Lambda code to AWS. Any additional infrastructure needed (like S3 buckets) were configured using Terraform before running `serverless deploy`.

Serverless uses the [Cloud Formation resource specification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html). This was finalized in 2011, and much as changed since then rendering it somewhat obsolete.

When running deployments, Serverless Framework uses AWS CloudFormation. CloudFormation has a 200 resource limit for a single CloudFormation run, which caused us to [split our deployment into multiple Serverless configuration sets](https://github.com/flexion/ef-cms/pull/2276).

Additionally, CloudFormation stacks can get into a locked state when using Serverless, and to unlock the stack to get it deployable again the stack has to be destroyed and re-created. This is a routine and regular issue that we have experienced. It was also painfully time-consuming to remove them and then recreate.

## Decision

> The change that we're proposing or have agreed to implement.

We will remove the Serverless Framework and deploy all infrastructure including Lambda code through Terraform.

## Consequences

> What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

- We currently use Serverless to run the API locally in development. We may be able to continue to user Serverless Framework for local development and use sls package to generate a package which can be deployed using Terraform, or we will need to find a new solution to run locally. Running serverless locally takes significant memory resources (gigabytes) for unknown reasons, which can cause issues when running in Docker.
- We can unify our deployment scripts into fewer steps because we will no longer have a 200 resource limit imposed on our configuration by CloudFormation (as we will no longer be using CloudFormation).
- Unifying our deployment steps will likely decrease deployment times. Our current deployments take about 30 minutes, and initial prototypes of Terraform-only deployments run in about 3 minutes.
