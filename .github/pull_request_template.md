# {Issue Number}: {Concise Summary}

#{Issue Number}

## Overview

{Descriptive summary of the objective and how it was achieved.}

## Changes

{List of changes made, organized semantically for an audience of DAWSON developers.}

## Verification

{List of steps taken to verify the changes, including any testing performed.}

## Dependencies Updated
{Template for the weekly dependency updates, delete for other pull requests}

For each runtime package (or group of related packages), document **affected application areas in plain language** under "Possible areas of testing" so reviewers know what to exercise. Prefer workflows over file paths—for example:

- [ ] logging in / signing out
- [ ] creating a petition or case
- [ ] filing, signing, and serving a document
- [ ] opening or viewing a PDF on a case
- [ ] generating a court- [ ]issued PDF (orders, notices, coversheets)
- [ ] advanced search (case, opinion, order)
- [ ] batch downloading a case or trial session
- [ ] email notifications after serve
- [ ] scanning a document (DWT)
- [ ] payment portal checkout
- [ ] charts or reports on dashboards

**Mandatory manual testing:** After the experimental deploy, manually exercise the application areas you listed (locally and in the experimental environment). Automated CI alone is not sufficient for the dependency rotation.

### Runtime dependencies

| Package | Version | Purpose | Used in | Possible areas of testing |
|---|---:|---|---|----|
| | | | | |

### Development dependencies

Verification of these is usually covered by CI (lint, unit, Cypress). Call out manual checks only when a tool change can affect local workflows (e.g. Cypress runner, local Postgres/OpenSearch images).

| Package | Version | Purpose | Used in |
|---|---:|---|---|
| | | | | |

### Dependencies checklist

- [ ] I have listed the updated packages, their purpose, where they are used, and the plain-language application areas to test (packages under `@aws-sdk` are optional to list for brevity).
- [ ] **Mandatory manual testing:** I have exercised the affected application areas listed above:
  - [ ] Locally
  - [ ] In an experimental environment after deploying this branch
- [ ] I have built and pushed a new Docker image from the Dockerfile to the experimental environment's ECR if needed, and updated CHANGES.md with the environment where it is deployed.
- [ ] I have reviewed and updated caveats/hand-managed dependencies as needed.
- [ ] I have successfully deployed the dependencies branch to an experimental environment.
- [ ] I have created new Devex/Opex tickets addressing further issues for examination as needed.

## Manual Deployment Steps

{Instructions for manually deploying the changes, if applicable. Delete this section if not.}

## Pull Request Checklist

_PRs that do not meet these criteria may be closed without review._

### External Contributors

- [ ] I have read the [External Contributions](docs/external-contributions.md) documentation and assert that this pull request adheres to the guidelines outlined therein.
    - [ ] The issue I chose to work on is appropriate for an external contributor.
    - [ ] This PR is targeting the correct branch for the appropriate stage of the development cycle.
    - [ ] I have performed all [Pre-PR Validation](docs/external-contributions.md#pre-pr-validation) locally.

### Internal Contributors (DAWSON Team Members)

- [ ] I have conducted thorough manual testing:
   - [ ] Locally
   - [ ] Experimental Environment (if necessary)
- [ ] If this PR is for a user story, or tech debt (devex, opex, design debt, etc.) that is user-facing, I have created test case(s) in TestRail and executed them.
- [ ] I assert that all DoD criteria for this issue have been met.
- [ ] If this PR includes a data migration with timing-specific manual test steps, I will coordinate the deployment with a manual tester to verify the timing-specific manual tests in real time.
- [ ] All user-facing changes have been verified to be free of accessibility issues via manual testing and automated accessibility tests.
