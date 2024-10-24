# Dependency Updates

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Library Update Steps

### Do the following for all package.json files

note: we have 2 package.json files, be sure to update both
  - ./package.json
  - ./web-api/runtimes/puppeteer/package.json

1. `npm outdated`: Informs us of minor and major version updates that we need to update manually. For major updates, there are often breaking API changes that require refactoring.

2. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the overrides block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

   > **Why am I seeing a medium severity for `quill`?**
   > Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364

3. Check if there are updates to either of the following in the main `Dockerfile`. Changing the `Dockerfile` requires publishing a new ECR image which is used as the docker image in CircleCI.

    - `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).
      - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
      - Change the version in `scripts/verify-terraform-version.sh`
    - `aws-cli`: check for a newer version on [AWS CLI](https://github.com/aws/aws-cli/tags) and use the latest version you can find for 2.x, replace it in the DockerFile
    - `docker cypress/base image`: [Check DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node-20) if an update is available for the current node version the project is using.

   To publish a new ECR docker image:

   - Increment the docker image version being used in `.circleci/config.yml` in the docker variable:
   `efcms-docker-image: &efcms-docker-image`. e.g. `ef-cms-us-east-1:3.1.6` -> `ef-cms-us-east-1:3.1.7`
   - Publish a docker image tagged with the incremented version number to ECR with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`. Do this for both the USTC account AND the Flexion account (using environment switcher).
     - example: `export DESTINATION_TAG=3.1.6 && npm run deploy:ci-image`
		 - you can verify the image deployed on AWS ECR repository "ef-cms-us-east-1"
     - if you run into any errors similar to 'At least one invalid signature was encountered', try running  `docker builder prune` or `docker system prune` on your local machine. https://stackoverflow.com/questions/62473932/at-least-one-invalid-signature-was-encountered

     > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

4. Check if there is an update to the Terraform AWS provider and update all of the following files to use the [latest version](https://registry.terraform.io/providers/hashicorp/aws/latest) of the provider.

regex search the entire project for `aws = "\d+.\d+.\d+"` and make sure it's to the latest version.  For example, some of these files have the providers defined:

 - ./shared/admin-tools/glue/glue_migrations/main.tf
 - ./shared/admin-tools/glue/remote_role/main.tf
 - ./web-api/terraform/applyables/account-specific/account-specific.tf
 - ./web-api/terraform/applyables/allColors/allColors.tf
 - ./web-api/terraform/applyables/blue/blue.tf
 - ./web-api/terraform/applyables/glue-cron/glue-cron-applyable.tf
 - ./web-api/terraform/applyables/green/green.tf
 - ./web-api/terraform/applyables/migration/migration-applyable.tf
 - ./web-api/terraform/applyables/migration-cron/migration-cron-applyable.tf
 - ./web-api/terraform/applyables/reindex-cron/reindex-cron-applyable.tf
 - ./web-api/terraform/applyables/switch-colors-cron/switch-colors-cron-applyable.tf
 - ./web-api/terraform/applyables/wait-for-workflow/wait-for-workflow-cron-applyable.tf

	> aws = "<LATEST_VERSION>"

5. Check through the list of caveats to see if any of the documented issues have been resolved.

6. Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

## Do Not Upgrade

### @fortawesome

- fortawesome packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### puppeteer and @sparticuz/chromium

- When updating puppeteer or puppeteer core in the project, make sure to also match versions in `web-api/runtimes/puppeteer/package.json` as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json.  Remember to run `npm install --prefix web-api/runtimes/puppeteer` to install and update the package-lock file.
- Puppeteer also has recommended versions of Chromium, so we should make sure to use the recommended version of chromium for the version of puppeteer that we are on. The chromium versions supported by puppeteer can be found [here](https://pptr.dev/supported-browsers)
- There is a high-severity security issue with ws (ws affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q); however, we only use ws on the client side, so this should not be an issue. (We tried to upgrade puppeteer anyway, but unsurprisingly the PDF tests failed because there is no newer version of Chromium that supports puppeteer.)

### pdfjs-dist

- `pdfjs-dist` has a major version update to ^3.x,x. A devex card has been created to track work being done towards updating the package. Please add notes and comments to [this card](https://trello.com/c/gjDzhUkb/1111-upgrade-pdfjs-dist).
- The high-severity security issue "vulnerable to arbitrary JavaScript execution" has been addressed by us here: https://app.zenhub.com/workspaces/flexionef-cms-5bbe4bed4b5806bc2bec65d3/issues/gh/flexion/ef-cms/10407 and can therefore be ignored.

### @uswds/uswds
- Keep pinned on 3.7.1, upgrading to 3.8.0+ will cause DAWSON UI issues with icon spacing and break Cypress Snapshots in the Cypress UI (as you hover over each step after initial run, it loses styles, making it harder to debug issues).

### eslint
- Keep pinned to 8.57.0 as most plugins are not yet compatible with v9.0.0: https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/
See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3699
- Keep eslint-plugin-cypress pinned to 3.5.0 due do the aforementioned compatibility issues.

### ws, 3rd party dependency of Cerebral
- When running npm audit, you'll see a high severity issue with ws, 'affected by a DoS when handling a request with many HTTP headers - https://github.com/advisories/GHSA-3h5v-q93c-6h6q'. This doesn't affect us as the vulnerability is on the server side and we're not using this package on the server. We tried to override this to 5.2.4 and 8.18.0 and weren't able to make this work as import paths have changed. In the mean time, we recommend skipping this issue. We could always fork the cerebral repo in the future if needed.

## Incrementing the Node Cache Key Version

It's rare to need modify cache key. One reason you may want to do so is if a package fails to install properly, and CircleCI, unaware of the failed installation, stores the corrupted cache. In this case, we will need to increment the cache key version so that CircleCI is forced to reinstall the node dependencies and save them using the new key. To update the cache key, locate `vX-npm` and `vX-cypress` (where X represents the current cache key version) in the config.yml file, and then increment the identified version.

