# {Issue Number}: {Concise Summary}

#{Issue Number}

## Overview

{Descriptive summary of the objective and how it was achieved.}

## Changes

{List of changes made, organized semantically for an audience of DAWSON developers.}

## Verification

{List of steps taken to verify the changes, including any testing performed.}

## Dependencies Updated

{Template for the weekly dependency updates. Delete this entire section (including the prompts below) when the PR is not a dependency update.}

Use **Bump** as `major`, `minor`, or `patch` based on the version change in this cycle. For each runtime package (or group of related packages), document **affected application areas in plain language** under "Possible areas of testing" so reviewers know what to exercise. Prefer workflows over file paths—for example:

- [ ] logging in / signing out
- [ ] creating a petition or case
- [ ] filing, signing, and serving a document
- [ ] opening or viewing a PDF on a case
- [ ] generating a court-issued PDF (orders, notices, coversheets)
- [ ] advanced search (case, opinion, order)
- [ ] batch downloading a case or trial session
- [ ] email notifications after serve
- [ ] scanning a document (DWT)
- [ ] payment portal checkout
- [ ] charts or reports on dashboards

**Mandatory manual testing:** After the experimental deploy, manually exercise the application areas you listed (locally and in the experimental environment). Automated CI alone is not sufficient for the dependency rotation.

### Step 1 — fill the package tables

Paste Prompt 1 into Copilot (or another coding agent), then paste the filled tables into this section (replacing the empty ones). Delete the prompt block from the final PR description once the tables are filled.

<details>
<summary>Prompt 1 — fill the package tables</summary>

```
Use the following tables to specify the list of packages that were updated during this cycle. Include a Bump column that specifies major, minor, or patch depending on the version number that was updated in the current cycle.

### Runtime dependencies

| Package | Bump | Version | Purpose | Used in | Possible areas of testing |
|---|---|---|---|---|----|
| | | | | | |

### Development dependencies

| Package | Bump | Version | Purpose | Used in | Possible areas of testing |
|---|---|---|---|---|----|
| | | | | | |
```

</details>

#### Runtime dependencies

| Package | Bump | Version | Purpose | Used in | Possible areas of testing |
|---|---|---|---|---|----|
| | | | | | |

#### Development dependencies

Verification of these is usually covered by CI (lint, unit, Cypress). Call out manual checks only when a tool change can affect local workflows (e.g. Cypress runner, local Postgres/OpenSearch images).

| Package | Bump | Version | Purpose | Used in | Possible areas of testing |
|---|---|---|---|---|----|
| | | | | | |

### Step 2 — generate the manual test flow

Run Prompt 2 **after** Step 1, using the filled tables above as context. Paste the resulting checklist below. Delete the prompt block from the final PR description once the checklist is filled.

<details>
<summary>Prompt 2 — generate the manual test flow</summary>

```
Based on the filled Runtime and Development dependency tables in this PR, give me a flow to test every single package that was affected. I need all upgraded packages. I have access to AWS and all the users, so list the steps with the UI I can click on (include test IDs where available) for testing all the dependencies that we upgraded and that may affect the flows in AWS. At the end of each step, enumerate the dependencies we are testing. Put it in Markdown format, with a checklist next to each step so when I complete it I can check it off.
```

</details>

#### Manual test checklist

{Paste the Markdown checklist produced by Prompt 2 here.}

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
