# PR (Pull Request) Workflow

Let's say you've been assigned to work on a bug or story... where do you branch from and to where to you create a PR?  Our current process of maintaining Dawson involves dealing with two separate forks of the repository.  Knowing where from where to base branches when working on bugs and stories can get confusing.  This part of the documentation is to help clarify the exact process a developer should follow if assigned to an issue.

## Branches of Interest

Since we mentioned we work from two forks of the repo, it is useful to understand the main branches we typically use to develop on this project.  A majority of Flexion developers will work off of the Flexion fork, but we often need to get work merged into the Court's repo.  Take note of the following branches:

### Flexion Fork Branches

- `flexion/develop` (for demonstrating complete work to the P.O.)
- `flexion/experimental1` (for deploying to a test environment)
- `flexion/experimental2` (for deploying to a test environment)
- `flexion/experimental3` (for deploying to a test environment)
- `flexion/experimental4` (for deploying to a test environment)
- `flexion/experimental5` (for deploying to a test environment)

You will occasionally push your changes to an experimental branch to verify if major devops or AWS work is required.

### US Tax Court Fork Branches

Multiple times during a sprint we need to interact with the US Tax Court fork.  Take note of the following branches.

- `court/hotfix` (a staging environment for when we need to fix something in production without also releasing other story/bug work)
- `court/test` (kept up to date with `court/staging`, but a staging environment for tests to run and the PO to verify work; where we merge our PRs to)
- `court/staging` (kept up to date with `court/prod`, but also a staging environment for the upcoming deploy; `court/test` merges into this after testing is complete; any new work branches off this branch)
- `court/prod` (the current version which is running on production)

If you are at Flexion, you will never need to touch `court/prod`.

?> Changes are committed to the `court/staging` branch which requires us to back merge changes into our in-progress branches so we are up-to-date.

## The Workflow

Please view the [diagram](https://lucid.app/documents/view/eb52faa0-5076-47f1-8cf4-d0fa2da8a768) as you go through this workflow.

### Terminology

- PO = Product Owner.
- PS = Product Specialist.

### Flexion Developer

1. Branch from `court/staging` into a branch in the Flexion fork.  Name the branch off the work you are working on (a story, a bug, a devex/opex item, etc.).
   1. If work item is simple enough, work directly on this new branch.
   2. If work item is more complex, you can choose to branch from the new branch and make sub-branches for the tasks.
2. Work on the work item.
   1. Feel free to push to the Flexion experimental branches as you go and do quick demos at stand-up.
   2. While work is ongoing, other work may be merged into `court/staging`.  Backmerge that into your branch (and any sub-branches) so you have the latest and greatest.
3. At some point, you presume the work is done.  The work needs to be reviewed by the Court and a PR created and merged.  This can be accomplished in two ways.
   - Verification occurs in a Flexion environment.
     1. Directly merge work to the `flexion/develop` branch or push to an experimental branch.
     2. Give the PO/PS a link to the environment that has your deployed work for PO/PS sign-off.
     3. Once verified by PO/PS, create the PR from your branch to `court/test`.
     4. Ask for PR reviews.  Reviews can come from both Flexion and the Court.
     5. Merge the PR.
   - Verification occurs in the `test` environment.
     1. Create the PR from your branch to `court/test`.
     2. Ask for PR reviews.  Reviews can come from both Flexion and the Court.
     3. Merge the PR.
     4. As mentioned under [Court Ops](#court-ops) below, tell the PO/PS that we're ready for review in the `test` environment.

### Court Developer

1. Very similar to Flexion developer.  Branch from `court/staging`, but branch into the same USTC fork.
2. Rest of the steps are the same.

### Court Ops

1. Review any PRs into `court/test` that you want.
2. Tests after PRs are merged into `court/test`.
   1. PO/PS verifies the work in the `test` environment which has prod-like data.  This step can be skipped if the PO/PS is confident enough with their initial verification earlier.
   2. Merge work into `court/irs` for IRS environment verification.  This step can be skipped if no testing with IRS is necessary.
   3. If tests fail, fail forward by branching from `court/test` into a branch to fix the bug.  If Flexion is working on the fix, branch into the Flexion fork or remain in the USTC repository if USTC is working on the fix.
3. Merge work to `court/staging` upon passing tests.
4. Once deploy window opens, merge `court/staging` into `court/prod`.
