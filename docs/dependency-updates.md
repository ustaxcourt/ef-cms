# Dependency Updates

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Library Update Steps

1. `npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.
2. `npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

   > **Caveats to major updates**:
   >
   > - `@fortawesome` packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.
   > - Check [caveats](#caveats) for info on which packages are locked down, but might be available to upgrade now.
   >
3. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. If a dependency is vulnerable and has no fix, consider replacing it with an alternative.

   > **Why am I seeing a high severity `dicer` issue?**
   > If you see this warning, run a full `npm install` rather than a single package update, as this will run the `postinstall` which is required to run the patch that addresses the security issue. Check [caveats](#caveats) for more info.

   > **Why am I seeing a medium severity for `quill`?**
   > Quill is used as our rich text editor for open text submissions. It currently has a potential XSS vulnerability if used incorrectly. This vulnerability can be avoided by using
   getContents/setContents in combination with the quill delta. Currently we are not at risk for how we are using Quill and this vulnerability is actively being disputed: https://github.com/quilljs/quill/issues/3364
4. Check if there are updates to either of the following in the main `Dockerfile`. Changing the `Dockerfile` requires publishing a new ECR image which is used as the docker image in CircleCI.

    - `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).
      - Change the version of the `terraform.zip` that we retrieve in `./Dockerfile`
      - Change the version in `scripts/verify-terraform-version.sh`
    - `aws-cli`: check for a newer version on [AWS CLI](https://github.com/aws/aws-cli/tags) and use the latest version you can find for 2.x, replace it in the DockerFile
    - `docker cypress/base image`: [Check DockerHub](https://hub.docker.com/r/cypress/browsers/tags?page=1&name=node) if an update is available for the current node version the project is using.

   To publish a new ECR docker image:

   - Increment the docker image version being used in `.circleci/config.yml` in the `docker: image:` property
   - Publish a docker image tagged with the incremented version number to ECR for both Flexion and USTC accounts with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`
   - Deploy as normal by triggering a CircleCI workflow

     > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

5. Verify the PDF's still pass by running the commands listed on `./docs/testing.md` under the _PDF Testing_ heading
6. Check through the list of caveats to see if any of the documented issues have been resolved.
7. Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

### Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

#### puppeteer / puppeteer-core

`puppeteer` and `puppeteer-core` have a major version update to ^19.x.x, but they need to stay at the same major version as `chrome-aws-lambda` (17.1.3). If we upgrade `puppeteer`, we see a `cannot read property 'prototype' of undefined` error. As of 02/27/23 `@sparticuz/chromium` provides an upgrade path for `@sparticuz/chrome-aws-lambda` (now deprecated) which may allow `puppeteer` to finally be updated.

#### s3rver

Check if there are updates to `s3rver` above version [3.7.1](https://www.npmjs.com/package/s3rver).

- Why is there a patch called `s3rver+3.7.1.patch`?
  - To address the high severity issue exposed by `s3rver`'s dependency on `busboy` 0.3.1, which relies on `dicer` that actually has the [security issue](https://github.com/advisories/GHSA-wm7h-9275-46v2). Unfortunately, `busboy` ^0.3.1 is incompatible with s3rver which is why there's a patch in place to make it compatible.
- How does the patch run?
  - This runs as part of the `npm postinstall` step.

### pdfjs-dist

`pdfjs-dist` has a major version update to ^3.x,x. A devex card has been created to track work being done towards updating. Please add notes and comments to [this card](https://trello.com/c/gjDzhUkb/1111-upgrade-pdfjs-dist).


### esbuild
There is a major upgrade to `esbuild` from 0.16.x to 0.17.x. The new major versions introduced breaking changes on how the `build` and `watch` commands work, which breaks reloading after changes in development environments. The major issue we ran into with upgrading was lack of documentation surrounding what the new events are called for watching for changes. Documentation for major version changes can be found [here](https://github.com/evanw/esbuild/releases/tag/v0.17.0), and in future release tags on Github, the esbuild website hasn't been updated since 0.17.x was released.

### esbuild-sass-plugin
There is a minor update to `esbuild-sass-plugin` from 2.5.0 to 2.6.0 that has a peer dependency for `esbuild@^0.17.10`. Due to esbuild being locked to 0.16.x in our project as seen in the above caveat and to prevent having to use the `--legacy-peer-deps` flag again this package is being set to accept patch updates for the time being. This can be lifted when we update esbuild or if this package were to have security vulnerabilites in the future that need to be addressed.


### stylelint
There is an update available to `stylelint` but if we update that package then there are issues with installing that require us to install with the `--legacy-peer-deps` flag again. The update to stylelint is not related to a security issue so I decided not to upgrade for now while its downstream dependencies rely on outdated packages.

This will happen until `stylelint-config-idiomatic-order` has updated to the latest `stylelint` ^15. I opened a [PR](https://github.com/ream88/stylelint-config-idiomatic-order/pull/79) to this project in hopes that this could move this along so we can update to ^15 of `stylelint` and associated packages. If security issues do arise and we wish to move forward to ^15 of `stylelint`, we would only get warnings on install (as of writing this).

### stylelint-config-standard
There is a major update to `stylelint-config-standard` from 29.0.0 to 30.0.1 that has a peer dependency for `stylelint@^15.0.0`. Currently `stylelint` is locked in our project as seen in the above caveat. When the lock is resolved this package should be able to be updated to the latest version.

### stylelint-config-standard-scss
There is a major update to `stylelint-config-standard-scss` from 6.1.0 to 7.0.1 that has a peer dependency for `stylelint@^15.0.0`. Currently `stylelint` is locked in our project as seen in the above caveat. When the lock is resolved this package should be able to be updated to the latest version.

### Incrementing the Node Cache Key Version

It's rare to need to increment or change the cache key. One reason you may want to do so is if something happens while storing the cache which corrupts it. For example, a few months ago a package failed to install while the cache was being stored. CircleCI had no idea that the installation didn't go according to plan and saved the corrupted cache. In this case, we incremented the cache key version so that CircleCI was forced to reinstall the node dependencies and save them under the new key. The cache key can be updated by searching within config.yml for vX-npm and vX-cypress where X is the current version of the cache key, then increment the version found.
