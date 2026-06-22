# {Issue Number}: {Concise Summary}

#{Issue Number}

## Overview

{Descriptive summary of the objective and how it was achieved.}

## Changes

{List of changes made, organized semantically for an audience of DAWSON developers.}

## Verification

{List of steps taken to verify the changes, including any testing performed.}

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
