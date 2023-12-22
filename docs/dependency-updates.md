# Dependency Updates

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Library Update Steps 

### Do the following for all package.json files

note: we have 3 package.json files, be sure to update them all
  - ./package.json
  - ./cognito-triggers-sls/package.json
  - ./web-api/runtimes/puppeteer/package.json

1. `npm update --save`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

2. `npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

3. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the overrides block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

   > **Why am I seeing a medium severity for `quill`?**
   > Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364

4. Check if there are updates to either of the following in the main `Dockerfile`. Changing the `Dockerfile` requires publishing a new ECR image which is used as the docker image in CircleCI.

    - `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).
      - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
      - Change the version in `scripts/verify-terraform-version.sh`
    - `aws-cli`: check for a newer version on [AWS CLI](https://github.com/aws/aws-cli/tags) and use the latest version you can find for 2.x, replace it in the DockerFile
    - `docker cypress/base image`: [Check DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node) if an update is available for the current node version the project is using.

   To publish a new ECR docker image:

   - Increment the docker image version being used in `.circleci/config.yml` in the docker variable: 
   `define: &efcms-docker-image`. e.g. `ef-cms-us-east-1:3.0.18` -> `ef-cms-us-east-1:3.0.19`
   - Publish a docker image tagged with the incremented version number to ECR with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`. Do this for both the USTC account AND the Flexion account (using environment switcher). 
     - example: `export DESTINATION_TAG=3.0.19 && npm run deploy:ci-image`
		 - you can verify the image deployed on AWS ECR repository "ef-cms-us-east-1"

     > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

5. Check if there is an update to the Terraform AWS provider and update all of the following files to use the [latest version](https://registry.terraform.io/providers/hashicorp/aws/latest) of the provider.
	- ./iam/terraform/account-specific/main/main.tf
	- ./iam/terraform/environment-specific/main/main.tf
	- ./shared/admin-tools/glue/glue_migrations/main.tf
	- ./shared/admin-tools/glue/remote_role/main.tf
	- ./web-api/terraform/main/main.tf
	- ./web-api/workflow-terraform/glue-cron/main/main.tf
	- ./web-api/workflow-terraform/migration/main/main.tf
	- ./web-api/workflow-terraform/migration-cron/main/main.tf
	- ./web-api/workflow-terraform/reindex-cron/main/main.tf
	- ./web-api/workflow-terraform/switch-colors-cron/main/main.tf
	- ./web-api/workflow-terraform/wait-for-workflow-cron/main/main.tf
	- ./web-client/terraform/main/main.tf

	> aws = "<LATEST_VERSION>"

6. Verify the PDF's still pass by running the commands listed on `./docs/testing.md` under the _PDF Testing_ heading

7. Check through the list of caveats to see if any of the documented issues have been resolved.

8. Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### @fortawesome

- fortawesome packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.

### puppeteer and @sparticuz/chromium

- Keep `@sparticuz/chromium` locked to 112.0.2 and `puppeteer` locked to 19.8.5 as 114+ and 20+ were causing pdf generation timeout bugs. (https://app.zenhub.com/workspaces/flexionef-cms-5bbe4bed4b5806bc2bec65d3/issues/gh/flexion/ef-cms/10087).

- When updating puppeteer or puppeteer core in the project, make sure to also match versions in `web-api/runtimes/puppeteer/package.json` as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json.  Remember to run `npm i` after updating the versions to update the package-lock.json.

### pdfjs-dist

- `pdfjs-dist` has a major version update to ^3.x,x. A devex card has been created to track work being done towards updating the package. Please add notes and comments to [this card](https://trello.com/c/gjDzhUkb/1111-upgrade-pdfjs-dist).

### s3-files (3.0.1)
- (10/20/2023) Upgrading from 3.0.0 -> 3.0.1 for s3 files breaks the batch download for batchDownloadTrialSessionInteractor. The api will start emitting ```self.s3.send is not a function``` error from the s3-files directory. Locking the s3-files version to 3.0.0 so that application does not break. To test if an upgrade to s3-files is working run the integration test: web-client/integration-tests/judgeDownloadsAllCasesFromTrialSession.test.ts

### jsdom
- (11/28/2023) Unable to update from 22.1.0 -> 23.0.0 as jsdom lists incorrect peer dependency for canvas as 3.0.0 which doesn't exist. see issue for more details: https://github.com/jsdom/jsdom/issues/3627. This will likely be resolved soon by jsdom.

## Incrementing the Node Cache Key Version

It's rare to need modify cache key. One reason you may want to do so is if a package fails to install properly, and CircleCI, unaware of the failed installation, stores the corrupted cache. In this case, we will need to increment the cache key version so that CircleCI is forced to reinstall the node dependencies and save them using the new key. To update the cache key, locate `vX-npm` and `vX-cypress` (where X represents the current cache key version) in the config.yml file, and then increment the identified version.

