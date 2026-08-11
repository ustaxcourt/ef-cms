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

1. Before running the `upgrade-npm-packages.ts` script, ensure that all packages listed in the caveats section below are in parity with the caveats list in the `upgrade-npm-packages.ts` file. As of 8/10/2026, `babel-jest`, `ts-jest`, `recharts`, and `eslint-plugin-cypress` are documented as hand-managed caveats below but are absent from the script's `caveats` array — the upgrade script will bump them unless reverted manually after each run. Only `eslint-plugin-cypress` required attention during the 8/10/2026 rotation (the other three were already at their latest versions), but the gap is real and should be closed over time.

1. You can use the `upgrade-npm-packages.ts` script for this process if you would like. Run the script in each directory containing a package.json:
   ```bash
   # Run these in order to avoid having to manually navigate to each package.json location

   # Root package.json
   node scripts/npm/upgrade-npm-packages.ts

   # web-api/runtimes/puppeteer/package.json
   (cd web-api/runtimes/puppeteer && node ../../../scripts/npm/upgrade-npm-packages.ts)

   # web-api/terraform/modules/batch/docker-image/package.json
   (cd web-api/terraform/modules/batch/docker-image && node ../../../../../scripts/npm/upgrade-npm-packages.ts)
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

> **Why am I seeing a vulnerability for `aws-sdk` v2 or `cognito-local`?**
> These are dev dependencies with known vulnerabilities. The aws-sdk v2 vulnerability doesn't affect our use case as it's related to region parameter validation and we're only using it for local development/testing.

#### 1.3 Approve or deny scripts as needed

Once we upgrade to `npm` v12, package install scripts will be opt-in instead of automatically being allowed to run. As of v11, we can approve deny scripts using `npm approve-scripts <pkg>` or `npm deny-scripts <pkg>`, so for the week of 7/13/2026 we approved the following packages and denied the rest: `cypress` and `puppeteer`. Note the approvals are version-specific, so these packages will likely have to be reapproved when they are upgraded.

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
 1. Manually update the Node.js version defined for the `docker-image-zipper` step in:
   - `./.circleci/config.yml`
 1. Update the node version used by our lambdas.
   - `web-api/terraform/modules/lambda/lambda.tf`
   - `web-api/terraform/modules/api/layers.tf`
 1. Update the `CHANGES.md` file with instructions for installing this NodeJS version locally. See [df83cf3](https://github.com/ustaxcourt/ef-cms/commit/df83cf3db69f2c6149cbef3ae213db488822cc2b) for an example.

 When updating Node.js, also consider `@ustaxcourt/payment-portal`:

 - If the Node.js upgrade stays within the published `@ustaxcourt/payment-portal` `engines.node` range (for example, a patch/minor update within the same major version), no `payment-portal` update is required.
 - If the Node.js upgrade falls outside the published `engines.node` range (for example, moving to a new major version), then `@ustaxcourt/payment-portal` must be updated and published with a compatible `engines.node` range before `npm ci` in ef-cms will succeed without engine workarounds.

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

### 5. Update PostgreSQL
Check to see if there is an updated version of the Aurora RDS postgres engine available. If an update is available, we'll need to update postgres locally, in github actions, and in deployed environments.

1. Use the [environment switcher](./additional-resources/environment-switcher.md) to point to an experimental environment and to retrieve a fresh AWS access key:
   ```bash
   . scripts/env/set-env.zsh expN
   ```
1. Determine the current Aurora RDS postgres engine version in this environment:
   ```bash
   aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" --query "DBClusters[0].EngineVersion" --region us-east-1 --output text
   ```
1. Check the list of available Aurora RDS postgres engine versions:
   ```bash
   aws rds describe-db-engine-versions --engine aurora-postgresql --query '*[].[EngineVersion]' --output text
   ```

#### 5.1 Update the Aurora RDS PostgreSQL engine to the latest version in a deployed environment

If a postgres engine update is available, we'll need to update the postgres engine in deployed environments.

1. Set the value of the `RDS_ENGINE_VERSION` secret in the `[env]_deploy` secrets in Secrets Manager:
   ```bash
   scripts/secrets/update-secret.ts --key "RDS_ENGINE_VERSION" --value "99.9"
   ```
1. Run a deployment to the experimental environment (e.g. by pushing your code changes to the experimental branch). Click on the `deploy` job and watch its output. Keep this CircleCI tab open.
1. In a new tab, log in to this experimental environment's AWS console, navigate to Aurora RDS, and keep an eye on the progress of the blue/green deployment. Keep this AWS console tab open.
1. Wait until the data is copying and then, in a new tab, log in to this DAWSON experimental environment and create or edit some data (file a document to an existing case, edit case metadata, edit a docket entry, etc.)
1. In the same DAWSON tab, prepare a similar edit that does not overwrite the previous edit. Do not submit it yet, and keep this DAWSON tab open.
1. Once the blue/green deployment is nearly complete in the AWS console tab, closely watch the output of the `upgrade-rds-engine-version.sh` script in CircleCI.
1. When you see the log messages "`Status: AVAILABLE`" and "`Blue/Green deployment is available. Initiating switchover...`", submit your edit in the DAWSON tab.
1. Observe that the edit will not complete in the DAWSON tab until soon after you see the "`Switchover completed successfully!`" log message in the CircleCI tab.
1. In the DAWSON tab, ensure the integrity of both previous edits.
1. Describe the required manual deployment step in the dependency updates pull request. See [PR #9899](https://github.com/ustaxcourt/ef-cms/pull/9899) for an example.
1. Describe the same manual deployment step in the `CHANGES.md` file. See [c702a02](https://github.com/ustaxcourt/ef-cms/commit/c702a02cd267d0325884febc739c04ceb6b0e0d2) for an example.

#### 5.2 Determine the correct Docker image tag for PostgreSQL

We run postgres via Docker locally and in GitHub Actions. The postgres image we use needs to match the version of postgres to which we are upgrading and the version of debian on which our docker container is based.

1. Determine the Debian version our `./Dockerfile` inherits by running:
   ```bash
   docker run --rm "cypress/browsers:$(cat ./Dockerfile | grep 'FROM cypress/browsers' | cut -d':' -f2)" cat /etc/os-release | grep VERSION_CODENAME
   ```
1. Check to see which tags are available for the `postgres` image by visiting the [Docker Hub postgres tags page](https://hub.docker.com/_/postgres/tags) or by running:
   ```bash
   curl -s "https://registry.hub.docker.com/v2/repositories/library/postgres/tags?page_size=100" | jq -r '.results[].name' | sort -V
   ```
1. The correct tag to use is the target version of postgres plus the Debian codename (e.g. `17.5-bookworm` for postgres 17.5 on Debian bookworm). Generally, the `postgres` images in Dockerhub will have newer versions of postgres than Aurora RDS has available, so don't be alarmed by this discrepancy.

#### 5.3 Update PostgreSQL to the latest version locally

If a postgres update is available, we'll need to update postgres locally.

1. Set the value of the `image` property in `web-api/src/persistence/postgres/docker-compose.yml` and `./docker-compose.yml` to correspond to the correct Docker image.
1. Run the api locally to verify:
   ```bash
   npm run start:api
   ```

#### 5.4 Update PostgreSQL to the latest version in github actions

If a postgres update is available, we'll need to update postgres in github actions.

1. Search the project for `image: postgres` and make sure it's set to the latest version. For example, some files in the `.github/workflows` directory will need to be updated.

### 6. Update OpenSearch
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

#### 6.1 Update OpenSearch to the latest version in a deployed environment

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
   scripts/tests/run-cypress.ts --file cypress/deployed-and-local/integration/advancedSearch/search.cy.ts
   ```
1. After the deployment's `cleanup` job is finished, rerun the OpenSearch indices report and ensure that all indices are present and populated, and that the aliases are configured as expected:
   ```bash
   scripts/reports/indices.ts
   ```
1. Describe the required manual steps in the dependency updates pull request. Be sure to indicate that `test` and `prod` will also need an `account-specific` deployment to update their `info` clusters' OpenSearch engine version as well. See [PR #9427](https://github.com/ustaxcourt/ef-cms/pull/9427) for an example.
1. Describe the same manual steps in the `CHANGES.md` file. See [c702a02](https://github.com/ustaxcourt/ef-cms/commit/c702a02cd267d0325884febc739c04ceb6b0e0d2) for an example.

#### 6.2 Update OpenSearch to the latest version locally

If an OpenSearch update is available, we'll need to update OpenSearch locally.

1. Set the value of the `image` property in `web-api/elasticsearch/docker-compose.yml` and `./docker-compose.yml` to correspond to the new version number.
1. Run the api locally to verify:
   ```bash
   npm run start:api
   ```

#### 6.3 Update OpenSearch to the latest version in github actions

If an OpenSearch update is available, we'll need to update OpenSearch in github actions.

1. Search the project for `opensearch-version:` and make sure it's set to the latest version. For example, some files in the `.github/workflows` directory will need to be updated.

### 7. Wrap up

- Check through the list of caveats to see if any of the documented issues have been resolved.

- Validate updates by deploying to an experimental environment

## Configurations
**Safe to upgrade, but we use a non-standard configuration intentionally**

### Husky
- As of Jan 21st, 2026: If `husky install` runs on the `postinstall` script, Husky will throw a warning stating `Husky install in postinstall is deprecated, use prepare instead`. Installing husky via the `prepare` script is recommended by Husky as best practice, but doesn't apply to ef-cms since we don't publish this as an npm package, and Husky only exists for us as a devDependency. Having it in `prepare` can fail if there are network interruptions during npm install, since `prepare` runs during installation before all packages may be fully downloaded, causing `husky install` to fail. For now, please ignore Husky's deprecation warning in the logs and stick with `postinstall: husky install`.

## Do Not Upgrade

### cerebral and @cerebral/react

- New versions of cerebral (5.2.1 to 5.2.4) and @cerebral/react (4.2.1 to 4.2.2) were released on February 27, 2025. These upgrades are the first since spring 2020. The new versions do not work with the import syntax used in `web-client/src/presenter/test.cerebral.ts` for `runAction` and `runCompute`, so keep these pinned to 5.2.1 and "github:ustaxcourt/cerebral-react#main" respectively for the time being.
- Will eventually need to decide to maintain our forked version `github:ustaxcourt/cerebral-react#main` or switch back to original repo now that it is started to be maintained again
- As of July 27, 2026: **cerebral 6.0.0** is now published on npm. Still blocked for the same reasons as 5.2.x — the import syntax in `web-client/src/presenter/test.cerebral.ts` for `runAction` and `runCompute` is incompatible. Keep pinned to 5.2.1 and `"github:ustaxcourt/cerebral-react#main"` respectively.

### babel-plugin-cerebral
**Installed Version: 1.0.2**

- Required by `babel.config.js` to transpile Cerebral template-literal syntax (for example, `` state`foo` ``). Keep this pinned alongside the `cerebral` and `@cerebral/react` versions above.
- See [removeCerebrealBabelPlugin.md](./removeCerebrealBabelPlugin.md) for the migration path if we remove this plugin in the future.

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### pdfjs-dist
**Current Version Installed: 6.2.108**

- When upgrading to version 5.4.624 the newer pdfjs-dist release relies on DOMMatrix, which caused errors in AWS Lambda when scraping text from PDFs. This worked locally but failed in the deployed environment because Lambda does not provide DOMMatrix. To resolve this, I added a polyfill using the `dommatrix` library that is used when DOMMatrix is undefined. See `getPdfJs.ts` and `parsePdf.ts` for details.
   - I debugged this by temporarily ignoring the smoketests in search.cy.ts in order for the build to pass and deploy to an exp environment. From there I ran the cypress smoketests on the exp environement locally, found the error in cloudwatch logs, tested multiple fixes and made the neccessary changes.

- Updated to next major version on 7/13/2026. `pdfjs` now supports at minimum Chrome version 125 and Safari version 18. However, after testing with older versions of Chrome, we can say that as long as the browser can run ES2022, it _should_ work.

- As of 8/10/2026: Updated to **6.2.108** for [GHSA-hq66-cqwq-w95j](https://github.com/advisories/GHSA-hq66-cqwq-w95j) (arbitrary JavaScript execution on opening a malicious PDF, affecting `>=5.6.83 <6.2.108`). Re-verify `getPdfJs.ts` and `parsePdf.ts`, especially the `DOMMatrix` polyfill, in an experimental deploy — the Lambda-only failure mode does not reproduce locally.

### DWT
**Current Installed DWT: 19.4.2**

Minor and patch versions of DWT _should_ be updated, but require that Court IT update the Windows clients in concert with our app. Do not bump `dwt` during weekly dependency rotations even if a newer version appears on npm — upgrades require the coordination sequence below and a standalone PR to `test`, not a bundled rotation.

- As of 8/10/2026: **Held at 19.4.2** during the 8/10/2026 dependency rotation per operator direction. 19.4.2 is both the pinned version in `package.json` and the latest published release on npm. Re-check each rotation; if a newer version appears, leave it alone until Court IT coordination is complete.

If an update is available for DWT:
- Coordinate with Court IT to have the Dynamsoft client updated on Court-owned Windows machines.
   1. Open a support ticket by emailing `support@ustaxcourt.gov`. In the email body, provide:
      1. the currently installed DWT server version
      1. the DWT server version to which we are upgrading
      1. the link to download the latest DWT client installer: `https://www.dynamsoft.com/dotnet-twain/downloads`
- Deploy the DWT server update to the `test` environment.
  1. Open a PR to `test` in which only the DWT server version is incremented.
  1. Merge the PR
  1. Trigger a deployment to the `test` environment.
- Coordinate with the DAWSON Product Specialist to test client/server backwards compatibility.
   1. With the old client version installed, navigate to the `test` environment and attempt to scan a document. If the "client upgrade" modal is shown, the new server version is **not** backwards compatible with the old client version.
   1. Install the new Windows client version. Navigate to DAWSON production and attempt to scan a document. If the "client upgrade" (which is actually a downgrade) modal is shown, the new client version is **not** backwards compatible with the old server version.
   1. With the new client version installed, navigate to the `test` environment and attempt to scan a document. Ensure the "client upgrade" modal is not shown.
- Only update DWT when:
   1. The Windows clients have **all** been confirmed to have received the client update, OR
   1. The old Windows client and new server version are backwards-compatible.

### puppeteer and @sparticuz/chromium
**Current Installed Puppeteer/Puppeteer-core: 25.1.0**
**Current Installed @sparticuz/chromium: 149.0.0**

- When updating puppeteer or puppeteer core in the project, make sure to also match versions in `web-api/runtimes/puppeteer/package.json` as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json. Remember to run `npm install --prefix web-api/runtimes/puppeteer` to install and update the package-lock file.
- Puppeteer also has recommended versions of Chromium, so we should make sure to use the recommended version of chromium for the version of puppeteer that we are on. The chromium versions supported by puppeteer can be found [here](https://pptr.dev/supported-browsers)
- There is a high-severity security issue with ws (ws affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q); however, we only use ws on the client side, so this should not be an issue. (Only @cypress/puppeteer depends on vulnerable version of puppeteer-core)
- March 20 2026: added an override for tar-fs so we stop getting a vulnerability reported for it.
- As of 15 April 2025, there is a high-security vulnerability for tar-fs < 3.0.7, which our current version of puppeteer relies on. As far as I can tell, this should not affect our use case since we are downloading from a trusted source (chromium). Hopefully the update to tar-fs will make its way into the next version of puppeteer we update to.
- Peer-dependency tar-fs has high security vulnerability but this shouldn't affect us as far as we are aware of.
- On October 27th, 2025, successfully updated @types/aws-lambda from 8.10.155 to 8.10.156. This required changing `AttributeValueWithName` in `processStreamUtilities.ts` from an `interface extends` to a `type` with intersection (`&`) because the new version of `AttributeValue` is no longer extendable by interfaces.
- As of June 23, 2026: Puppeteer 25.2.0 requires Chrome for Testing 150.0.7871.24, which means `@sparticuz/chromium` would need to be updated to `150.x`. However, `@sparticuz/chromium@150.x` has not yet been published to npm (latest available is `149.0.0`). Skipping the puppeteer 25.2.0 update until `@sparticuz/chromium@150.x` is available.
- As of June 25, 2026: Puppeteer 25.2.1 requires Chrome for Testing 150.0.7871.24, which means `@sparticuz/chromium` would need to be updated to `150.x`. However, `@sparticuz/chromium@150.x` has not yet been published to npm (latest available is `149.0.0`). Skipping the puppeteer 25.2.x update until `@sparticuz/chromium@150.x` is available.
- As of July 27, 2026: Puppeteer **25.4.0** is available. Still blocked — `@sparticuz/chromium` latest on npm remains **149.0.0**; puppeteer 25.2.x and above require Chrome for Testing 150.x.
- As of 8/10/2026: Puppeteer **25.5.0** is available. Still blocked — `@sparticuz/chromium` latest on npm remains **149.0.0**; puppeteer 25.2.x and above require Chrome for Testing 150.x.

### ws, 3rd party dependency of Cerebral

- When running npm audit, you'll see a high severity issue with ws, 'affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q'. This doesn't affect us as the vulnerability is on the server side and we're not using this package on the server. We tried to override this to 5.2.4 and 8.18.0 and weren't able to make this work as import paths have changed. In the mean time, we recommend skipping this issue. We could always fork the cerebral repo in the future if needed.
- March 20 2026: the Cerebral dependency that depended on WS, universal-websocket-client, has already updated to use a newer version of WS without this vulnerability. The only usage of WS left with this vulnerability was a version of puppeteer within cypress. Until cypress updates this dependency we added an override for WS to set it to the current version.

### quill
**Installed Version: 1.3.7**
**DO NOT UPDATE - TO BE REPLACED BY EMBEDDED MICROSOFT WORD**

- Quill released version 2 in April 2024. It includes substantial changes. Because the focus is currently on Postgres, we have left it at a previous version.
- January 9th, 2026: We successfully updated Quill from 1.3.7 to 2.0.3. The way Quill handles imports and props in function calls changed, requiring changes to our Quill.tsx and TextEditor.tsx.
- January 27th, 2026: The decision was made to revert us back to 1.3.7 due to a bug where line tabing would break upon edit. No further updates to Quill should be made - there is a plan in the pipeline to swap Quill out for an embedded Microsoft Office Editor.

### quill-delta-to-html
**Installed Version: 0.12.1**

- Used by `TextEditor.tsx` to convert Quill deltas to HTML. Keep this pinned alongside `quill` 1.3.7 until the embedded Microsoft Word editor replaces Quill.

### jest and jest-environment-jsdom
**Installed Versions:**
**jest: 30.4.2**
**jest-environment-jsdom: 30.4.1**

- Upgrade `jest`, `babel-jest`, and `jest-environment-jsdom` together manually rather than via the upgrade script. Verify the full unit test suites after any bump.
- On June 26, 2025, newer versions of `jest` conflicted with `ts-jest` 29.x; we stayed on Jest 29 until `ts-jest` caught up.
- On June 30, 2025, a `jest-environment-jsdom` bump caused failures in unit tests that use `Object.defineProperty` (for example, `getPdfJs.test.ts`). Re-test those specs before removing this pin.

### websocket
**Installed Version: 1.0.35**

- Direct dependency for the local websocket server in `web-api/src/app-local.ts` and for the integration-test WebSocket polyfill in `web-client/integration-tests/helpers.ts`. Verify local stack websocket behavior after upgrading.

### p-queue
**Installed Version: 9.3.3**

- `p-queue` v7 and above are ESM-only. Jest must transpile them via `transformIgnorePatterns` in `web-api/jest-unit.config.ts` (added December 10, 2025).
- On September 19, 2025, upgrading past v6 caused module-import errors in GitHub Actions until the Jest config was updated. Patch upgrades within v9 are generally safe but require re-running the web-api unit tests.

### @babel/*
**Current Installed Versions: 7.29.7** (`@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`)

- Update on July 13, 2026: `@babel/core` v8.x is available, but upgrading is blocked by `esbuild-plugin-babel-cached@0.2.3` and `ts-jest@29.4.11`, which have versions below v8 listed as peer dependencies. `ts-jest` is likely to be updated, but `esbuild-plugin-babel` has been archived. `esbuild-plugin-babel-cached` appears to be a fork we developed, so we could update this ourselves to support `babel` v8, or find another solution that doesn't use this plugin.
- As of July 27, 2026: `@babel/core` **v8.0.x** is available on npm. Still blocked by `esbuild-plugin-babel-cached@0.2.3`, which publishes peer `@babel/core@^7.0.0` only. The nested-override approach noted in prior rotations remains untested.
- As of 8/10/2026: `@babel/core` **v8.x** is available on npm. Still blocked by `esbuild-plugin-babel-cached@0.2.3`, which publishes peer `@babel/core@^7.0.0` only.

### @types/node
**Installed Version: 24.13.3**
The major version of this package should match our major version of Node. We should use a package that starts with 24. <b>However</b>, the current installed version is 24.13.3, which <b>does not match the current installed version</b>. It is a known issue and another attempt will be made at the next Node.js and @types/node update.

- [Dependencies 03 09 2026](https://github.com/ustaxcourt/ef-cms/pull/9465/files), Node.js was `v24.14.0`, but `@types/node` could not be updated to `24.14.0`, so it stayed pinned at `24.12.0`.

- [Dependencies 04 06 2026](https://github.com/ustaxcourt/ef-cms/pull/9882/files), There was still no `@types/node` release matching `24.14.1`, so we upgraded to the latest available version under major `24`.

- As of April 20, 2026: Node.js updated to `v24.15.0`; `npm view @types/node@24.15.0` and any `24.13+` under major `24` are still unpublished, so **24.12.2** remains the closest match.

- As of May 18, 2026: Node.js updated to `v24.15.0`; `npm view @types/node@24.15.0` and any `24.13+` under major `24` are still unpublished, so **24.12.4** remains the closest match.

- As of May 26, 2026: Node.js updated to `v24.16.0`; `npm view @types/node@24.16.0` and any `24.13+` under major `24` are still unpublished, so **24.12.4** remains the closest match.

- As of June 1, 2026: Node.js remains at `v24.16.0`; `npm view @types/node@24.16.0` and any `24.13+` under major `24` are still unpublished, so **24.12.4** remains the closest match.

- As of June 23, 2026: Node.js updated to `v24.17.0`; `@types/node@24.13.x` is now available for the first time (previously stuck at `24.12.4`). Updated to **24.13.2**, the latest published version under major `24`. No `24.14+` published yet.

- As of July 13, 2026: Updated to **24.13.3**, the latest published version under major `24`. No `24.14+` published yet.

- As of 8/10/2026: **24.13.3** remains the latest published version under major `24` (latest overall is 26.2.0). No change.

### TypeScript
**Installed Version: 7.0.2 and 6.0.2**

- As of July 13, 2026, we have updated to TypeScript v7. However, version 7.0 does not ship with an API, so libraries that need it, such as `typescript-eslint` and `ts-node`, will not run. To fix this, we have an aliased version of TS 6.0.2 installed running simultaneously with TS v7, under `"typescript": "npm:@typescript/typescript6@6.0.2"` and `"@typescript/native": "npm:typescript@7.0.2"` respectively. TS v6 will be available for the libraries that need it, and `tsc` will use the new, faster v7. See [here](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0) for further details.

**When upgrading TypeScript, make sure that the new version is supported by ts-jest and ts-node.**

- After upgrading cypress past 15.14.0, it is now compatible with TS6. Updated tsconfig for cypress to support version 6 during the week of 5/18/2026

- Ensure the pinned version of typescript globally installed in `web-api/terraform/modules/batch/docker-image/Dockerfile` matches the project-wide version and is compatible with ts-node. On 7/08/2026, we started pulling TS7 when building this Dockerfile, and the batch job would not start up because ts-node was unable to find the TS compiler, so we pinned it to 6.0.2.

- On 7/13/2026, we updated the batch job docker to use the same aliased install as our package.json `typescript@npm:@typescript/typescript6@6.0.2`. Once TS 7.1.x is released, we should check if `ts-node` is compatible with it.

### ts-node
**Installed Version: 10.9.2**

**When upgrading ts-node, make sure that the new version is compatible with our pinned TypeScript version.**

- Ensure the pinned version of ts-node globally installed in `web-api/terraform/modules/batch/docker-image/Dockerfile` matches the project-wide version.

### Commander override for s3rver
**Current Installed Version: 12.1.0 (Override Version, see notes below)**

- On 12/16/25 we added an version override for the commander package for s3rver. It was failing to start up the test server with our command after s3rver started using 14.0.2 of commander. We reverted it to the previous working version 12.1.0.

```
npm run start:s3rver
error: too many arguments. Expected 0 arguments but got 2.
```

### @fortawesome
**Installed Versions:**
**@fortawesome/fontawesome-svg-core: 7.1.0**
**@fortawesome/free-regular-svg-icons: 7.1.0**
**@fortawesome/free-solid-svg-icons: 7.1.0**
**@fortawesome/react-fontawesome: 3.1.1**

- Updating minor or patch versions for fortawesome packages may include changes to icon names, breaking existing references causing tests that rely on these icons to fail as well as potentially being visually different from previous versions of the icon being updated.
- Updating these packages would require a greater level of granularity to identify and validate all existing icon usage and coordination with other parties to align on design changes as well as any output documentation such as screenshots before upgrading.
- July 13, 2026: it was decided to no longer update these packages outside of a vulnerability, due to the reasons above. Seeing as these packages are mostly CSS, it is unlikely any vulnerabilities will come up.

### minimatch, a 3rd party dependency of several of our packages
**Installed Versions: <10.0.0**
- A high severity vulnerability was found affecting all minimatch versions below 10.2.2 outlined [here](https://github.com/advisories/GHSA-3ppc-4f35-3m26). This significantly increased the number of vulnerabilities counted when running npm i
- minimatch is a dependency for glob which is a dependency of a handful of packages in our code base. The full list can be found by running:
```bash
   npm list minimatch
```
- Almost all packages affected that we use, are on minimatch version 9 or lower. Some of packages like eslint and eslint/js have recent major updates that may fix this issue for their respective dependencies but some other dependencies don't readily support eslint version 10 yet and are unable to be successfully upgraded.
- Other packages haven't seen an update in months, sometimes up to a year and discussions maybe needed to determine if alternatives are necessary to limit exposure until all affected packages can be upgraded.
- For now leave these versions unchanged, and keep an eye on the packages listed in the command above until updates and testing are successful.
- As of June 25, 2026: minimatch 10.2.5 is the latest. Still blocked since upstream packages have not yet migrated to minimatch 10.x.
- July 13, 2026: An earlier note incorrectly stated that `npm audit` no longer reported this vulnerability.
- As of July 27, 2026: `npm audit` still flags `minimatch` 2.0.0–10.0.2 (high) via the `brace-expansion` advisory ([GHSA-7r86-64r9-qc3w](https://github.com/advisories/GHSA-7r86-64r9-qc3w), DoS via unbounded expansion length). A `brace-expansion` override above 5.0.7 clears most of the cascade through `minimatch`, `glob`, and the Jest/Babel/ESLint dependency trees. Upstream packages migrating to minimatch 10.x remains the long-term fix.

### eslint and @eslint/js
**Installed Versions:**
**eslint: 9.39.5**
**@eslint/js: 9.39.5**
- We have two eslint plugins that support only up to version 9 of eslint as a peer dependency, so we cannot update to version 10 yet. These are eslint-plugin-jsx-a11y, eslint-plugin-react.
- There are new patches being published for eslint version 9. Check the npm website to see if there are new ones and manually install them if so.
- As of June 25, 2026: eslint 10.5.0 is the latest, but still blocked since `eslint-plugin-jsx-a11y` and `eslint-plugin-react` still declare `eslint ^9` as their peer dependency. `9.39.4` is the latest 9.x patch; nothing new to install.
- July 13, 2026: updated to 9.39.5
- As of July 27, 2026: eslint **10.8.0** and `@eslint/js` **10.0.1** are available. Still blocked — `eslint-plugin-jsx-a11y` peer is `^3 || … || ^9` and `eslint-plugin-react` peer is `^3 || … || ^9.7`; neither accepts eslint 10. Latest 9.x remains **9.39.5**.
- As of 8/10/2026: eslint **10.8.1** and `@eslint/js` **10.0.1** are available. Still blocked — `eslint-plugin-jsx-a11y` and `eslint-plugin-react` peers do not accept eslint 10. Latest 9.x remains **9.39.5**.

### eslint-plugin-cypress
**Installed Version: 6.4.4**

- As of 8/10/2026: **eslint-plugin-cypress 7.0.0** declares `peerDependencies: { eslint: ">=10" }`, but we are pinned to eslint **9.39.5** by the `eslint-plugin-jsx-a11y` / `eslint-plugin-react` block. Keep at **6.4.4** until eslint 10 is unblocked. This package is absent from the upgrade script's `caveats` array, so the script will bump it to 7.x each rotation unless reverted manually afterward.

### uuid
- On 05-18-2026, we added an override for uuid to fix a vulnerability with versions below 11.

### js-yaml
**Installed Version: 4.3.1**
- On 06-16-2026, we added a `js-yaml` override to address the code injection vulnerability affecting versions below 3.14.2 and 4.1.1 ([GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68)).
- July 27, 2026: moved the override from 4.2.0 to 4.3.0. The 4.2.0 pin sat inside the vulnerable range for merge-key chain quadratic CPU consumption ([GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m), CVE-2026-59869). Keep the override at 4.3.0 or later unless all transitive consumers are confirmed to resolve to a patched version.
- As of 8/10/2026: moved the override from 4.3.0 to **4.3.1**. The 4.3.0 pin sat inside the vulnerable range for quadratic CPU consumption in `!!omap` resolution ([GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), CVE-2026-59870). **5.2.3** is the latest overall but is a major jump for transitive consumers; **4.3.1** is the minimal patched version.

### image-blob-reduce and pica
**Installed Versions:**
**image-blob-reduce: 5.0.1**
**pica: 10.0.2**
- image-blob-reduce is packaged with a version of pica, however it is not re-exporting the package correctly, so we directly added pica to our package.json to use it in our web-client applicationContext. Make sure the version of pica we install matches the version image-blob-reduce is using.
- If image-blob-reduce is upgraded, we can potentially remove pica from our dependency list. Check that the below import works, and if it does we can remove pica.

`import ImageBlobReduce, { pica } from 'image-blob-reduce';`

### @joi/date
8/7/26 - @joi/date had a major version update with breaking changes. Biggest thing is that it changed to just mjs. Updating requires changing how we import this package in validators that use tests.
From

```ts
import joiDate from '@joi/date';
...
const joi: Root = joiImported.extend(joiDate);
```
to

```ts
import { JoiDate } from '@joi/date';
...
const joi: Root = joiImported.extend(JoiDate);
```

The issue is with Jest. Jest doesn't work with mjs, so in our config we need to either map to a cjs version of the package or transform it ourselves. The package does not have a cjs dist and trying to run a transformation on the package wasn't working with our tests.

### @recharts/devtools
**Installed Version: 0.0.14**

- 8/7/26 - Newer versions of this dependency restrict the version rechart that it supports. The current version of recharts is at `3.10.1`. Newer versions of devtools only supports `3.9.0`. Keeping it pinned at `0.0.14` until new versions support our version of recharts.
- As of 8/10/2026: **@recharts/devtools 0.0.16** peers on `recharts: 3.9.0` exactly, and we are on **3.10.1**. Still pinned at **0.0.14**.

## Troubleshooting

### Incrementing the Node Cache Key Version

It's rare to need modify cache key. One reason you may want to do so is if a package fails to install properly, and CircleCI, unaware of the failed installation, stores the corrupted cache. In this case, we will need to increment the cache key version so that CircleCI is forced to reinstall the node dependencies and save them using the new key. To update the cache key, locate `vX-npm` and `vX-cypress` (where X represents the current cache key version) in the config.yml file, and then increment the identified version.
