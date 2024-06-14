# What is DAWSON

For an overview of the project, refer to [What is DAWSON](/what-is-dawson.md).

# Running Locally

Refer to [Running Locally](/running-locally) to get started.

# Making Changes

## Branches of Interest

Take note of the following branches.

- `court/test` (kept up to date with `court/staging`, but a staging environment for tests to run and the PO to verify work)
- `court/staging` (kept up to date with `court/prod`, but also a staging environment for the upcoming deploy; any new work branches off this branch)
- `court/prod` (the current version which is running on production)

?> Changes are committed to the `court/staging` branch which requires us to back merge changes into our in-progress branches so we are up-to-date.

?> Note that this document assumes you have chosen `court` as the name of your upstream for the US Tax Court fork. If you have chosen something else, say `ustaxcourt`, any reference to `court/{branch_name}` refers to `{upstream}/{branch_name}`.

### External Contributor

Below is a general overview of the workflow that would best prepare your contribution for inclusion in the project.

1. Branch from `court/staging` into a branch in a separate fork.
    1. How you work in your own fork is up to you, but keep in mind the public nature of the main fork.
        1. Your branch name should be professional.
        1. Your commit messages should be professional.
1. Work on the issue.
    1. If your work is of a nature such that testing in a deployed environment is needed, contact [Dawson support](dawson.support@ustaxcourt.gov).
    1. While work is ongoing, other work may be merged into `court/staging`.  Backmerge that into your branch (and any sub-branches) so you have the latest and greatest.
1. Prior to submitting any pull requests, please perform [Pre-PR Validation](#pre-pr-validation)
1. At some point, you presume the work is done.  The work needs to be reviewed by the Court and PRs created and merged.
    - This can be accomplished in two ways.
        - Verification occurs in the `test` environment.
            1. Create the PR from your branch to `court/test`.
               1. If there are merge conflicts refer to [Handling Merge Conflicts](#handling-merge-conflicts)
            1. Court engineering staff will respond to your PR.
            1. If the Court engineers merge your PR, do not delete your feature branch, make a PR to `court/staging` from your branch.
        - Verification in a deployed environment is not needed.
            1. Create the PR from your branch to `court/staging`.
            1. Court engineering staff will respond to your PR.
            1. If your branch is approved and merged, you have our thanks for your contribution.
1. If there is PO feedback, address the feedback on the original feature branch.  Go back to step 3.
1. If your work passes PO review, congratulations!  Create a PR from your original feature branch to `court/staging`.  You will need to wait for a court engineer to approve your PR and merge it.  Your code is now in `court/staging` and ready to fly to production on the next deployment!

?> We will be civil, but we are opinionated about the architecture and our coding standards. Refer to [Pull Request (PR) Review Process](code-review.md) for more about coding standards. We may use [emoji's](https://github.com/erikthedeveloper/code-review-emoji-guide) in our comments.

?> We will expect civil behavior from contributors as well, and reserve the right to close PR's for unacceptable behavior. For more on what is considered unacceptable behavior, refer to [18F Open Source Policy GitHub repository](https://github.com/18f/open-source-policy).

#### Pre-PR Validation

Please follow these steps to validate your changes before submitting a pull request:

1. Fork the repository and create a branch from `staging`.
1. Run `npm install` in the repository root.
    1. Do not delete `package-lock.json`.
1. If reasonable for the changes being made, write tests.
1. Run `npm run lint:fix` in the repository root.
1. Run the following scripts, ensuring no failures:
    1. Run first in separate terminals:
       1. `npm run start:api:ci`
       1. `npm run start:client:ci`
       1. `npm run start:public:ci`
    1. `npm run test:api`
    1. `npm run test:client:unit`
    1. `npm run cypress:integration`
    1. `npm run test:scripts`
    1. `npm run test:shared`
       

#### Handling Merge Conflicts

In an effort to keep untested `court/test` changes out of your feature branch, make an intermediate duplicate branch that will contain the resolved merge conflicts. If your feature branch is titled `feature-123` follow these steps:
1. Create an intermediate duplicate branch while on your feature branch: `git checkout -b intermediate-feature-123`.
1. Resolve merge conflicts: `git merge court/test`.  You will need to replace `court` with the name of the court's upstream.
1. Then create the PR between `court/test` and your intermediate feature branch (e.g. `intermediate-feature-123`).
1. A subsequent PR into `court/staging` would need to be created from your original branch (e.g. `feature-123`).
