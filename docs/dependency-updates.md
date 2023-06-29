# Dependency Updates

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Library Update Steps

1. `npm update --save`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.
2. `npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

   > **Caveats to major updates**:
   >
   > - `@fortawesome` packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.
   > - Check [caveats](#caveats) for info on which packages are locked down, but might be available to upgrade now.
   >
3. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the overrides block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

   > **Why am I seeing a high severity `dicer` issue?**
   > If you see this warning, run a full `npm install` rather than a single package update, as this will run the `postinstall` which is required to run the patch that addresses the security issue. Check [caveats](#caveats) for more info.

   > **Why am I seeing a medium severity for `quill`?**
   > Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using
   getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364

   > **Why am I seeing a medium severity for `semver`?**(6/22/2023)
   > Semver is the versioner used for npm itself and has > 250M downloads weekly. Semver 7.5.2 is a nested dependency for our packages and we must wait until a fix is pushed out. Considering the use of this package in npm itself I would expect a fix soon.
4. Check if there are updates to either of the following in the main `Dockerfile`. Changing the `Dockerfile` requires publishing a new ECR image which is used as the docker image in CircleCI.

    - `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).
      - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
      - Change the version in `scripts/verify-terraform-version.sh`
    - `aws-cli`: check for a newer version on [AWS CLI](https://github.com/aws/aws-cli/tags) and use the latest version you can find for 2.x, replace it in the DockerFile
    - `docker cypress/base image`: [Check DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node) if an update is available for the current node version the project is using.

   To publish a new ECR docker image:

   - Increment the docker image version being used in `.circleci/config.yml` in the `docker: image:` property
   - Publish a docker image tagged with the incremented version number to ECR for both Flexion and USTC accounts with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`
     - If you are on an M1 Machine, make sure to set the environment variable `DOCKER_DEFAULT_PLATFORM=linux/amd64`.
     - example: `export DESTINATION_TAG=2.24.0 && npm run deploy:ci-image`

     > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

5. Verify the PDF's still pass by running the commands listed on `./docs/testing.md` under the _PDF Testing_ heading
6. Check through the list of caveats to see if any of the documented issues have been resolved.
7. Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

### Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### puppeteer

When updating puppeteer or puppeteer core in the project make sure to also match versions in web-api/runtimes/puppeteer/package.json as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json.  Remember to run `npm i` after updating the versions to update the package-lock.json.

#### s3rver

Check if there are updates to `s3rver` above version [3.7.1](https://www.npmjs.com/package/s3rver).

- Why is there a patch called `s3rver+3.7.1.patch`?
  - To address the high severity issue exposed by `s3rver`'s dependency on `busboy` 0.3.1, which relies on `dicer` that actually has the [security issue](https://github.com/advisories/GHSA-wm7h-9275-46v2). Unfortunately, `busboy` ^0.3.1 is incompatible with s3rver which is why there's a patch in place to make it compatible.
- How does the patch run?
  - This runs as part of the `npm postinstall` step.
- As of 6/23/2023 there is a high security vulnerability for transitive dependency in s3rver for "fast-xml-parser". This cannot be fixed using the patch method above as it is a dependency of a dependency. Currently waiting for pull request to update fast-xml parser dependency(https://github.com/jamhall/s3rver/pull/813). Ignoring high security vulnerability as this is a dev dependency and not included in production code.

### pdfjs-dist

`pdfjs-dist` has a major version update to ^3.x,x. A devex card has been created to track work being done towards updating. Please add notes and comments to [this card](https://trello.com/c/gjDzhUkb/1111-upgrade-pdfjs-dist).

### Incrementing the Node Cache Key Version

It's rare to need to increment or change the cache key. One reason you may want to do so is if something happens while storing the cache which corrupts it. For example, a few months ago a package failed to install while the cache was being stored. CircleCI had no idea that the installation didn't go according to plan and saved the corrupted cache. In this case, we incremented the cache key version so that CircleCI was forced to reinstall the node dependencies and save them under the new key. The cache key can be updated by searching within config.yml for vX-npm and vX-cypress where X is the current version of the cache key, then increment the version found.
