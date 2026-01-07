# Dependency Updates

## Overview

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Dependency Update Steps

### 1. Update all package.json files

**Note**: The DAWSON repository contains three package.json files that must be updated. They are:

- `./package.json`
- `./web-api/runtimes/puppeteer/package.json`
- `./web-api/terraform/modules/batch/docker-image/package.json`

1. You can use the `upgrade-npm-packages.ts` script for this process if you would like:
   ```bash
   scripts/npm/upgrade-npm-packages.ts
   ```
1. After running, ensure all three package.json files are updated.

#### 1.1 Run `npm outdated`

This command informs us of minor and major version updates that we need to update manually. For major updates, there are often breaking API changes that require refactoring.

#### 1.2 Run `npm audit`

This command informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the overrides block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

> **Why am I seeing a medium severity for `quill`?**
> Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364

> **Why am I seeing a high severity for `ws`?**
> [See below](#ws-3rd-party-dependency-of-cerebral).

> **Why am I seeing a high severity for `tar-fs`?**
> [See below](#puppeteer-and-sparticuzchromium).

> **Why am I seeing a vulnerability for `fast-redact`?**
> On November 19th, 2025. Unsuccessfully rolled back cognito-local to 3.7.1

### 2. Update third-party dependencies

#### 2.1 Update Node.js version

DAWSON uses the version of Node.js specified in `.nvmrc`. Consult the [documentation](https://nodejs.org/en/about/previous-releases) to determine if an upgrade is required.

When updating Node.js, keep in mind:

- Only update to newer patch or minor versions within the current major version
- Do not update to odd-numbered releases since they become unsupported after six months
- Do not update to the next even-numbered major version until it enters Active LTS status
- Do not update to the next even-numbered major version until it is offically supported by AWS Lambda. [Supported Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)

To update Node.js:

1. Update the version in `.nvmrc`.
1. Manually update the `"engines"` property in:
   - `./package.json`
   - `./web-api/runtimes/puppeteer/package.json`
1. Manually update the images in:
   - `./Dockerfile`
   - `./web-api/runtimes/puppeteer/Dockerfile`
1. Manually update the Node.js version in:
   - `./.circleci/config.yml`
1. Update the node version used by our lambdas.
   - `web-api/terraform/modules/lambda/lambda.tf`
   - `web-api/terraform/modules/api/layers.tf`
1. Update the `CHANGES.md` file with instructions for installing this NodeJS version locally. See [df83cf3](https://github.com/ustaxcourt/ef-cms/commit/df83cf3db69f2c6149cbef3ae213db488822cc2b) for an example.

#### 2.2 Update `Dockerfile` as needed

Check if updates are necessary for the main `Dockerfile`. We base this image on `cypress/browsers`, a debian linux image that contains the latest (headless) versions of Chrome, Firefox, and Edge.

- Base image - `cypress/browsers`
  - Check [DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node-24) if an update is available for the current node version the project is using
  - Change the `FROM` line in the `Dockerfile` to use the new version
- `terraform`
  - Check the [Terraform site](https://developer.hashicorp.com/terraform/install) if an update is available
  - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
  - Change the version in `scripts/verify-terraform-version.sh`
- `aws-cli`
  - Check for the latest 2.x version of the [AWS CLI](https://github.com/aws/aws-cli/tags)
  - Change the version of the `awscliv2.zip` that we retrieve in `./DockerFile`

#### 2.3 Publish new ECR docker image if needed

If the `Dockerfile` has changed, you will need to build a new docker image and publish it to an experimental environment's ECR.

1. Increment the docker image version being used in `.circleci/config.yml` in the `&efcms-docker-image` variable. See [PR #5980](https://github.com/ustaxcourt/ef-cms/pull/5980/files#diff-78a8a19706dbd2a4425dd72bdab0502ed7a2cef16365ab7030a5a0588927bf47) for an example.
1. Use the [environment switcher](./additional-resources/environment-switcher.md) to point to an experimental environment:
   ```bash
   . scripts/env/set-env.zsh expN
   ```
1. Publish a docker image tagged with the incremented version number to ECR:
   ```bash
   npm run deploy:ci-image
   ```
1. To verify the image was published, run:
   ```bash
   aws ecr describe-images --repository-name ef-cms-us-east-1 --query 'sort_by(imageDetails,& imagePushedAt)[-1].imageTags[0]'
   ```
1. If you run into any errors similar to 'At least one invalid signature was encountered', try running `docker builder prune` or `docker system prune` on your local machine. https://stackoverflow.com/questions/62473932/at-least-one-invalid-signature-was-encountered

   > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

1. Update the `CHANGES.md` file with instructions for deploying this new docker image to other environments. Be sure to indicate the experimental environment to which you just deployed the image. See [df83cf3](https://github.com/ustaxcourt/ef-cms/commit/df83cf3db69f2c6149cbef3ae213db488822cc2b) for an example.

### 3. Update Terraform AWS provider

Check if there is an update to the Terraform AWS provider and update our `.tf` files to use the [latest version](https://registry.terraform.io/providers/hashicorp/aws/latest) of the provider.

1. Search the entire project for `source  = "hashicorp/aws"` and make sure it's set to the latest version. For example, some of these files have the AWS provider defined:
   - `./web-api/terraform/modules/worker/providers.tf`
1. Change the version of the AWS provider using two decimal notation (e.g. `6.19.0`) to ensure providers only increment patch versions automatically

### 4. Update Terraform OpenSearch provider

Check if there is an update to the Terraform OpenSearch provider and update our `.tf` files to use the [latest version](https://registry.terraform.io/providers/opensearch-project/opensearch/latest) of the provider.

1. Search the entire project for `source  = "opensearch-project/opensearch"` and make sure it's set to the latest version. For example, these files have the OpenSearch provider defined:
   - `web-api/terraform/applyables/account-specific/account-specific.tf`
   - `web-api/terraform/modules/kibana/providers.tf`
1. Change the version of the OpenSearch provider

### 5. Update OpenSearch

Check to see if there is an updated version of OpenSearch available. If an update is available, we'll need to update OpenSearch locally, in github actions, and in deployed environments.

1. Use the [environment switcher](./additional-resources/environment-switcher.md) to point to an experimental environment and to retrieve a fresh AWS access key:
   ```bash
   . scripts/env/set-env.zsh expN
   ```
1. Determine the current OpenSearch engine version in this environment:
   ```bash
   aws opensearch describe-domain --domain-name "efcms-search-${ENV}-${SOURCE_TABLE_VERSION}" --query "DomainStatus.EngineVersion" --output text
   ```
1. Use the AWS CLI to list the available versions of OpenSearch:
   ```bash
   aws opensearch list-versions
   ```

#### 5.1 Update OpenSearch to the latest version in a deployed environment

If an OpenSearch update is available, we'll need to update OpenSearch in deployed environments.

1. Run the OpenSearch indices report and note the indices and aliases in this deployed environment:
   ```bash
   scripts/reports/indices.ts
   ```
1. Set the value of the `ES_ENGINE_VERSION` secret in the `[env]_deploy` secrets in Secrets Manager:
   ```bash
   scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_99.9"
   ```
1. Run a deployment to the experimental environment.
1. While the OpenSearch upgrade is being performed (during the `allColors` terraform deployment), verify cluster is still functional by running search smoketests against current color:
   ```bash
   scripts/run-cypress.sh -sct cypress/deployed-and-local/integration/advancedSearch/search.cy.ts
   ```
1. After the deployment's `cleanup` job is finished, rerun the OpenSearch indices report and ensure that all indices are present and populated, and that the aliases are configured as expected:
   ```bash
   scripts/reports/indices.ts
   ```
1. Describe the required manual steps in the dependency updates pull request. Be sure to indicate that `test` and `prod` will also need an `account-specific` deployment to update their `info` clusters' OpenSearch engine version as well. See [PR #9427](https://github.com/ustaxcourt/ef-cms/pull/9189) for an example.
1. Describe the same manual steps in the `CHANGES.md` file. See [c702a02](https://github.com/ustaxcourt/ef-cms/commit/c702a02cd267d0325884febc739c04ceb6b0e0d2) for an example.

#### 5.2 Update OpenSearch to the latest version locally

If an OpenSearch update is available, we'll need to update OpenSearch locally.

1. Set the value of the `image` property in `web-api/elasticsearch/docker-compose.yml` to correspond to the new version number.
1. Run the api locally to verify:
   ```bash
   npm run start:api
   ```

#### 5.3 Update OpenSearch to the latest version in github actions

If an OpenSearch update is available, we'll need to update OpenSearch in github actions.

1. Search the project for `opensearch-version:` and make sure it's set to the latest version. For example, some of the files in the `.github/workflows` directory will need to be updated.

### 6. Wrap up

- Check through the list of caveats to see if any of the documented issues have been resolved.

- Validate updates by deploying to an experimental environment

## Do Not Upgrade

### cerebral and @cerebral/react

- New versions of cerebral (5.2.1 to 5.2.4) and @cerebral/react (4.2.1 to 4.2.2) were released on February 27, 2025. These upgrades are the first since spring 2020. The new versions do not work with the import syntax used in `web-client/src/presenter/test.cerebral.ts` for `runAction` and `runCompute`, so keep these pinned to 5.2.1 and "github:ustaxcourt/cerebral-react#main" respectively for the time being.
- Will eventually need to decide to maintain our forked version `github:ustaxcourt/cerebral-react#main` or switch back to original repo now that it is started to be maintained again

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### pdfjs-dist

- As of [this release](https://github.com/mozilla/pdf.js/releases/tag/v5.1.91), and I think [this PR](https://github.com/mozilla/pdf.js/pull/19689), pdfjs seems to expect certain browser-side API functionality when loaded. This causes issues with our Cypress tests. The best way to fix this is worth investigating further. Perhaps we could polyfill, or even consider creating an issue in the pdfjs repo.
- Look at `shared/src/business/utilities/pdfs/getPdfJs.ts`
- As 0f 01/05/2026 `pdfjs-dist` is still causing Cypress Test to fail randomly

### DWT

- Minor versions of DWT _should_ be updated, but require that Court IT update the Windows clients in concert with our app. Do not update without coordinating.
- Stay at DWT v19.2.0, wait until January to update to 19.3.0

### puppeteer and @sparticuz/chromium

- When updating puppeteer or puppeteer core in the project, make sure to also match versions in `web-api/runtimes/puppeteer/package.json` as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json. Remember to run `npm install --prefix web-api/runtimes/puppeteer` to install and update the package-lock file.
- Puppeteer also has recommended versions of Chromium, so we should make sure to use the recommended version of chromium for the version of puppeteer that we are on. The chromium versions supported by puppeteer can be found [here](https://pptr.dev/supported-browsers)
- There is a high-severity security issue with ws (ws affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q); however, we only use ws on the client side, so this should not be an issue. (Only @cypress/puppeteer depends on vulnerable version of puppeteer-core)
- As of 15 April 2025, there is a high-security vulnerability for tar-fs < 3.0.7, which our current version of puppeteer relies on. As far as I can tell, this should not affect our use case since we are downloading from a trusted source (chromium). Hopefully the update to tar-fs will make its way into the next version of puppeteer we update to.
- Peer-dependency tar-fs has high security vulnerability but this shouldn't affect us as far as we are aware of.
- On October 27th, 2025, successfully updated @types/aws-lambda from 8.10.155 to 8.10.156. This required changing `AttributeValueWithName` in `processStreamUtilities.ts` from an `interface extends` to a `type` with intersection (`&`) because the new version of `AttributeValue` is no longer extendable by interfaces.

### ws, 3rd party dependency of Cerebral

- When running npm audit, you'll see a high severity issue with ws, 'affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q'. This doesn't affect us as the vulnerability is on the server side and we're not using this package on the server. We tried to override this to 5.2.4 and 8.18.0 and weren't able to make this work as import paths have changed. In the mean time, we recommend skipping this issue. We could always fork the cerebral repo in the future if needed.

### quill

- Quill released version 2 in April 2024. It includes substantial changes. Because the focus is currently on Postgres, we have left it at a previous version.

### babel-jest, babel-core

Tried to update to 30.0.0-beta.3 from 29.7.0 on Friday, June 06, 2025, we weren't able to update it because it conflicts with ts-jest 29.3.4.
On June 26 2025, newer versions of babel-core and jest core also started to cause issues with ts-jest. Once ts-jest is updated these issues should all clear up.

- On September 19th, 2025, babel-jest was successfully updated to 30.0.0 from 29.7.0.
- On September 19th, 2025, babel/core was successfully updated to 7.28..4 from 7.28.3, had some issues with Github Actions checks running all the way through, but Github still gave the commit a check. Refer to this PR for more info. https://github.com/ustaxcourt/ef-cms/pull/9164

### @types/node

The major version of this package should match our major version of Node. At the moment that we are using Node v24.11.1 so we should use a package that starts with 24.

- [Dependencies 12 01 2025](https://github.com/ustaxcourt/ef-cms/pull/9465/files), Node.js was updated to v24.11.1, successfully updated @types/node to 24.10.2 to match Node.js v24.11.1

### TypeScript

We cannot update TypeScript version beyond v5.8.3 until ts-jest supports it

- On September 19th, 2025, tried to update to 5.9.2, the highest non-beta version but we would need to address the Typescript issues. I ran out of time to do so. Refer to this PR. https://github.com/ustaxcourt/ef-cms/pull/9164
- On October 27th, 2025, tried to update to 5.9.3. The update introduced 116+ new TypeScript errors due to stricter type checking:
  - 35 null-checking errors (`TS18047` "possibly null") from stricter null-checking on DOM elements, refs, and properties
  - 49 "never" type inference errors where TypeScript more aggressively infers `never` type for uninitialized or narrowed types
  - 55 `IApplicationContext` type errors related to stricter type checking on mock vs. real application context objects
  - Additional errors in test files and UI components

The decision was made to revert back to 5.8.3 as the migration would require multiple days of dedicated work.

- On November 19th, 2025, updated to typescript 5.9.3 and as a result resolved many of the typing issues involved in pdf buffers, applicationContext between client, shared, and api.

### Commander override for s3rver

- On 12/16/25 we added an version override for the commander package for s3rver. It was failing to start up the test server with our command after s3rver started using 14.0.2 of commander. We reverted it to the previous working version 12.1.0.

```
npm run start:s3rver
error: too many arguments. Expected 0 arguments but got 2.
```

## Troubleshooting

### Incrementing the Node Cache Key Version

It's rare to need modify cache key. One reason you may want to do so is if a package fails to install properly, and CircleCI, unaware of the failed installation, stores the corrupted cache. In this case, we will need to increment the cache key version so that CircleCI is forced to reinstall the node dependencies and save them using the new key. To update the cache key, locate `vX-npm` and `vX-cypress` (where X represents the current cache key version) in the config.yml file, and then increment the identified version.
