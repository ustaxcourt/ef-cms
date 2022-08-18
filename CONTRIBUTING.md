# Welcome!

We're so glad you're thinking about contributing to a U.S. Tax Court open source project! If you're unsure about anything, just ask — or submit the issue or pull request anyway. The worst that can happen is you'll be politely asked to change something. We love all friendly contributions.

## Code of Conduct

We want to ensure a welcoming environment for all of our projects. Our staff follows the [18F Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md) and all contributors should do the same.

## Things to Be Familiar With

We encourage you to read this CONTRIBUTING policy (you are here), its [LICENSE](LICENSE.md), and its [README](README.md).

If you have any questions or want to read more, check out the [18F Open Source Policy GitHub repository](https://github.com/18f/open-source-policy), or just [shoot us an email](mailto:18f@gsa.gov).

## Public domain

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.

## Bugs

### Known Issues

We track issues on the GitHub [Issues page](https://github.com/ustaxcourt/ef-cms/issues). Before filing any new issues, please check to see if we've addressed the problem before or already have an existing issue related to it.

### Reporting Issues

From the [Issues page](https://github.com/ustaxcourt/ef-cms/issues) you can click the `New issue` button or go straight to the [list of templates](https://github.com/ustaxcourt/ef-cms/issues/new/choose).

### Security-related Issues

For security-sensitive issues, please do not file a public issue. Rather, please email [Dawson support](dawson.support@ustaxcourt.gov).

### Proposing Changes

We welcome pull requests, but we do still want those changes to be related to an [Issue](#reporting-issues). Please file one prior to submitting a pull request.

### Pull Request Procedures

Please follow these steps before submitting a pull request:

1. Fork the repository and create a branch from `staging`.
1. Run `npm install` in the repository root.
   1. Do not delete `package-lock.json`.
1. If reasonable for the changes being made, write tests.
1. Run `npm run lint:fix` in the repository root.
1. Ensure that all tests run with the following scripts pass:
   1. `npm run test:api`
   1. `npm run test:client`
   1. `npm run test:shared`
   1. `npm run test:pa11y`

For non-trivial changes, PR's should be initiated into the `test` branch. Others can be initiated straight into the `staging` branch.

#### Active Pull Requests

We will be civil, but we are opinionated about the architecture and coding standards in the project. Please do not be offended if the team requests changes or otherwise provides feedback. We may use [emoji's](https://github.com/erikthedeveloper/code-review-emoji-guide) in our comments.

We will expect civil behavior from contributors as well, and reserve the right to close PR's for unacceptable behavior. For more on what is considered unacceptable behavior, refer to [18F Open Source Policy GitHub repository](https://github.com/18f/open-source-policy).

### Contribution Prerequisites

You have Node 14 installed and in use.
