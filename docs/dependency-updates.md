# Dependency Updates

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

At the moment, the only task we rotate is updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change.

> After changes are made to any dependencies, deploy to an experimental environment to verify that all tests pass!

## Library Update Steps

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
   `define: &efcms-docker-image`. e.g. `ef-cms-us-east-1:3.0.8` -> `ef-cms-us-east-1:3.0.9`
   - Publish a docker image tagged with the incremented version number to ECR for both Flexion and USTC accounts with the command: `export DESTINATION_TAG=[INSERT NEW DOCKER IMAGE VERSION] && npm run deploy:ci-image`
     - If you are on an M1 Machine, make sure to set the environment variable `DOCKER_DEFAULT_PLATFORM=linux/amd64`.
     - example: `export DESTINATION_TAG=2.24.0 && npm run deploy:ci-image`

     > Refer to [ci-cd.md](ci-cd.md#docker) for more info on this as needed

5. Verify the PDF's still pass by running the commands listed on `./docs/testing.md` under the _PDF Testing_ heading

6. Check through the list of caveats to see if any of the documented issues have been resolved.

7. Validate updates by deploying, with a [migration](./additional-resources/blue-green-migration.md#manual-migration-steps), to an experimental environment. This helps us verify that the package updates don't affect the migration workflow.

## Caveats

Below is a list of dependencies that are locked down due to known issues with security, integration problems within DAWSON, etc. Try to update these items but please be aware of the issue that's documented and ensure it's been resolved.

### @fortawesome

- fortawesome packages are locked down to pre-6.x.x to maintain consistency of icon styling until there is usability feedback and research that determines we should change them. This includes `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, and `@fortawesome/fontawesome-svg-core`.

### puppeteer and @sparticuz/chromium

- Keep `@sparticuz/chromium` locked to 112.0.2 and `puppeteer` locked to 19.8.5 as 114+ and 20+ were causing pdf generation timeout bugs. (https://app.zenhub.com/workspaces/flexionef-cms-5bbe4bed4b5806bc2bec65d3/issues/gh/flexion/ef-cms/10087).

- When updating puppeteer or puppeteer core in the project make sure to also match versions in web-api/runtimes/puppeteer/package.json as this is our lambda layer which we use to generate pdfs. Puppeteer and chromium versions should always match between package.json and web-api/runtimes/puppeteer/package.json.  Remember to run `npm i` after updating the versions to update the package-lock.json.

#### s3rver
- As of 7/26/2023 there is a high security vulnerability for transitive dependency in s3rver for "fast-xml-parser". This cannot be fixed using the patch method above as it is a dependency of a dependency. Currently waiting for pull request to update fast-xml parser dependency(https://github.com/jamhall/s3rver/pull/813).
- The s3rver package has been abandoned for two years now and is unlikely to be fixed. A community member has forked the repo and fixed the vulnerabilities so we are switching to the forked version here: github:20minutes/s3rver (https://github.com/20minutes/s3rver). This means the s3rver community version is unlikely to be updated however, the original npm package has been abandoned for over 2 years.

### pdfjs-dist

- `pdfjs-dist` has a major version update to ^3.x,x. A devex card has been created to track work being done towards updating. Please add notes and comments to [this card](https://trello.com/c/gjDzhUkb/1111-upgrade-pdfjs-dist).

### Incrementing the Node Cache Key Version

It's rare to need to increment or change the cache key. One reason you may want to do so is if something happens while storing the cache which corrupts it. For example, a few months ago a package failed to install while the cache was being stored. CircleCI had no idea that the installation didn't go according to plan and saved the corrupted cache. In this case, we incremented the cache key version so that CircleCI was forced to reinstall the node dependencies and save them under the new key. The cache key can be updated by searching within config.yml for vX-npm and vX-cypress where X is the current version of the cache key, then increment the version found.
