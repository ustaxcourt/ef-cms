# Environments

## Setup

### Initial environment setup

This document covers the initial setup needed to get EF-CMS continuous integration and deployment configured to a destination hosted in AWS.

#### 1. Register for service accounts

1. [Amazon Web Services](https://portal.aws.amazon.com/gp/aws/developer/registration/) — hosting.
1. [CircleCI](https://circleci.com/signup/) — test running and code deployment.

#### 2. Configure your local developer machine.

1. Follow the [running locally](./running-locally.md) instructions to get the project running locally.

#### 3. Configure CircleCI to deploy this environment.

A prerequisite for a successful build within CircleCI is [access to CircleCI’s 2 X-large instances](https://circleci.com/pricing/#comparison-table). The memory footprint of the underlying services are too large for smaller instances — attempting a build with smaller instances will result in a cascading series of test failures, because Elasticsearch can’t operate within the memory constraints. At present, CircleCI requires contacting their sales staff to get access to 2 X-large instances.

1. Configure CircleCI to [build this project](https://circleci.com/docs/2.0/getting-started/#setting-up-circleci).

1. Generate an [API token](https://circleci.com/docs/guides/toolkit/managing-api-tokens).

1. Set up [environment variables](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project) in Project Settings:

  | Environment variable        | Value                        | Description                                                                                                    |
  |-----------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------|
  | `AWS_PAGER`                 | `cat`                          | Prevents AWS CLI from paginating output                                                                      |
  | `CIRCLE_MACHINE_USER_TOKEN` | API token you just generated | Used by CircleCI to interact with the CircleCI API, for example to approve wait steps or to trigger workflows. |

#### 4. Create the DAWSON environment in AWS.

1. Execute the [Creating a New Lower Environment in an Empty AWS Account](./operations/runbooks/create-new-lower-environment.md) runbook to create the necessary AWS resources for this DAWSON environment.

## Deployments

### CI/CD process with CircleCI

Once CircleCI is configured, any merge to the corresponding branch will be eligible for a deployment to that environment. You can trigger a deployment by clicking "Trigger Workflow" in the CircleCI UI.

## Teardown

Sometimes you'll find the need to remove an environment to start from a fresh state.  To remove an environment, configure your local machine the same as you would during the [setup](/environments?id=setup) section.

```bash
npm run destroy:env
npm run destroy:client <ENV>
npm run destroy:api <ENV>
npm run destroy:allColors <ENV>
npm run destroy:blue <ENV>
npm run destroy:green <ENV>
npm run destroy:reindex-cron <ENV>
npm run destroy:stale-cases-email-cron <ENV>
npm run destroy:switch-colors-cron <ENV>
npm run destroy:wait-for-workflow-cron <ENV>
```

See [the troubleshooting guide](/additional-resources/troubleshooting) for solutions to problems that may arise during the setup and teardown processes.
