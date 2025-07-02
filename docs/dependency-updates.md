# Dependency Updates

## Overview

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Dependency Update Steps

### 1. Update all package.json files

**Note**: The DAWSON repository contains three package.json files the must be updated. They are:

  - `./package.json`
  - `./web-api/runtimes/puppeteer/package.json`
  - `./web-api/terraform/modules/batch/docker-image/package.json`

You can use the scripts/npm/upgrade-npm-packages.ts for this process, however make sure all three package.json files are updated.

#### 1.1 Run `npm outdated`

This command informs us of minor and major version updates that we need to update manually. For major updates, there are often breaking API changes that require refactoring.

#### 1.2 Run `npm audit`

This command informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the overrides block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

> **Why am I seeing a medium severity for `quill`?**
> Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364

> **Why am I seeing a high severity for `ws`?**
> [See below](#ws-3rd-party-dependency-of-cerebral).

> **Why am I seeing a medium severity for `@babel/runtime`?**
> [See below](#babelruntime).

### 2. Update third-party dependencies

#### 2.1 Update Node.js version

DAWSON uses the version of Node.js specified in `.nvmrc`. Consult the [documentation](https://nodejs.org/en/about/previous-releases) to determine if an upgrade is required.

When updating Node.js, keep in mind:

- Only update to newer patch or minor versions within the current major version
- Do not update to odd-numbered releases since they become unsupported after six months
- Do not update to the next even-numbered major version until it enters Active LTS status

To update Node.js:

1. Update the version in `.nvmrc`.
2. Manually update the `"engines"` property in:
  - `./package.json`
  - `./web-api/runtimes/puppeteer/package.json`
3. Manually update the images in:
  - `./Dockerfile`
  - `./web-api/runtimes/puppeteer/Dockerfile`
3. Manually update the Node.js version in:
  - `./.circleci/config.yml`
4. Manually update DAWSON's GitHub Actions YAML files.
  - **Note:** These files will point to `.nvmrc` in a future update.
5. Update the node version used by our lambdas. 
  - `web-api/terraform/modules/lambda/lambda.tf`
  - `web-api/terraform/modules/api/layers.tf`

#### 2.2 Update `Dockerfile` as needed

Check if there are updates to any the following in the main `Dockerfile`. Changing the `Dockerfile` requires publishing a new ECR image which is used as the docker image in CircleCI.

- `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).
  - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
  - Change the version in `scripts/verify-terraform-version.sh`
- `aws-cli`: check for a newer version on [AWS CLI](https://github.com/aws/aws-cli/tags) and use the latest version you can find for 2.x, replace it in the DockerFile
- `docker cypress/base image`: [Check DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node-22) if an update is available for the current node version the project is using.

#### 2.3 Publish new ECR docker image if needed

To publish a new ECR docker image:

- Increment the docker image version being used in `.circleci/config.yml` in the docker variable:
`efcms-docker-image: &efcms-docker-image`. e.g. `ef-cms-us-east-1:4.3.27` -> `ef-cms-us-east-1:4.3.28`

- Publish a docker image tagged with the incremented version number to ECR with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`. Do this for both the USTC account AND the Flexion account (using environment switcher).
  - example: `export DESTINATION_TAG=4.3.27 && npm run deploy:ci-image`
  - you can verify the image deployed on AWS ECR repository "ef-cms-us-east-1"
  - if you run into any errors similar to 'At least one invalid signature was encountered', try running  `docker builder prune` or `docker system prune` on your local machine. https://stackoverflow.com/questions/62473932/at-least-one-invalid-signature-was-encountered

  > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

### 3. Update Terraform AWS provider

Check if there is an update to the Terraform AWS provider and update all of the following files to use the [latest version](https://registry.terraform.io/providers/hashicorp/aws/latest) of the provider.

regex search the entire project for `"~> \d+.\d+.\d+"` and make sure it's to the latest version.  For example, some of these files have the providers defined:

  - `./shared/admin-tools/glue/glue_migrations/main.tf`
  - `./shared/admin-tools/glue/remote_role/main.tf`

	> version = "~>~ <LATEST_VERSION>"

### 4. Wrap up

- Check through the list of caveats to see if any of the documented issues have been resolved.

- Run [PDF tests](./testing.md) locally.

- Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

## Do Not Upgrade

### cerebral and @cerebral/react

- New versions of cerebral (5.2.1 to 5.2.4) and @cerebral/react (4.2.1 to 4.2.2) were released on February 27, 2025. These upgrades are the first since spring 2020. The new versions do not work with the import syntax used in `web-client/src/presenter/test.cerebral.ts` for `runAction` and `runCompute`, so keep these pinned to 5.2.1 and "github:ustaxcourt/cerebral-react#main" respectively for the time being.

### @fortawesome

- fortawesome packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### puppeteer and @sparticuz/chromium

- When updating puppeteer or puppeteer core in the project, make sure to also match versions in `web-api/runtimes/puppeteer/package.json` as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json.  Remember to run `npm install --prefix web-api/runtimes/puppeteer` to install and update the package-lock file.

- Puppeteer also has recommended versions of Chromium, so we should make sure to use the recommended version of chromium for the version of puppeteer that we are on. The chromium versions supported by puppeteer can be found [here](https://pptr.dev/supported-browsers)

- There is a high-severity security issue with ws (ws affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q); however, we only use ws on the client side, so this should not be an issue. (Only @cypress/puppeteer depends  on vulnerable version of puppeteer-core)

- As of 15 April 2025, there is a high-security vulnerability for tar-fs < 3.0.7, which our current version of puppeteer relies on. As far as I can tell, this should not affect our use case since we are downloading from a trusted source (chromium). Hopefully the update to tar-fs will make its way into the next version of puppeteer we update to.

Peer-dependency tar-fs has high security vulnerability but this shouldn't affect us as far as we are aware of.

### ws, 3rd party dependency of Cerebral

- When running npm audit, you'll see a high severity issue with ws, 'affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q'. This doesn't affect us as the vulnerability is on the server side and we're not using this package on the server. We tried to override this to 5.2.4 and 8.18.0 and weren't able to make this work as import paths have changed. In the mean time, we recommend skipping this issue. We could always fork the cerebral repo in the future if needed.

### quill

- Quill released version 2 in April 2024. It includes substantial changes. Because the focus is currently on Postgres, we have left it at a previous version.

### pdfjs-dist

- As of [this release](https://github.com/mozilla/pdf.js/releases/tag/v5.1.91), and I think [this PR](https://github.com/mozilla/pdf.js/pull/19689), pdfjs seems to expect certain browser-side API functionality when loaded. This causes issues with our Cypress tests. The best way to fix this is worth investigating further. Perhaps we could polyfill, or even consider creating an issue in the pdfjs repo.

### babel-jest, babel-core, jest
Tried to update to 30.0.0-beta.3 from 29.7.0 on Friday, June 06, 2025, we weren't able to update it because it conflicts with ts-jest 29.3.4.
On June 26 2025, newer versions of babel-core and jest core also started to cause issues with ts-jest. Once ts-jest is updated these issues should all clear up.

### jest-environment-jsdom
This dependency was causing problems with specific unit tests that were using Object.defineProperty. 
We should tackle this issue either in a dedicated ticket or in a future dependency update but for now (6/30/25) we left it.

### @types/node
The major version of this package should match our major version of node. At the moment that we are using node v22.16.0 so we should use a package that starts with 22.

## Incrementing the Node Cache Key Version

It's rare to need modify cache key. One reason you may want to do so is if a package fails to install properly, and CircleCI, unaware of the failed installation, stores the corrupted cache. In this case, we will need to increment the cache key version so that CircleCI is forced to reinstall the node dependencies and save them using the new key. To update the cache key, locate `vX-npm` and `vX-cypress` (where X represents the current cache key version) in the config.yml file, and then increment the identified version.