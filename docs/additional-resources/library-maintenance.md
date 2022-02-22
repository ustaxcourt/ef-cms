# Library Maintenance

## Caveats
- `cypress`: Do not upgrade past 8.5.0 as anything above that version will cause the "Failed to connect to bus" [error](https://trello.com/c/iuq0gJ6P/1008-ci-error-failed-to-connect-to-the-bus). 

- `@fortawesome/free-solid-svg-icons`: v6.0.0 caused a regression with faThumbtack so it is not importable. [Github issue](https://github.com/FortAwesome/Font-Awesome/pull/18665) Leaving both this package and `fortawesome/free-regular-svg-icons` at v5.15.4 until this is patched.

- `@fortawesome/fontawesome-svg-core`: upgrading from v1.2.36 to v1.3.0 causes icon sizing issues. Since it was released 2 days ago as of writing this, seems worth waiting for a patch, similar to the other @fortawesome packages.

- `puppeteer-core` and `puppeteer`: locked to minor version ~13.2.0 since 13.3.0 was released a few hours ago and appears to be causing issues with various class exports.

- `puppeteer-core` within `web-api/runtimes/puppeteer`: locked to v13.0.1 because that's the highest version that `chrome-aws-lambda` [supports](https://github.com/alixaxel/chrome-aws-lambda/issues/254) at the moment

## Update Steps

1. `npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

2. `npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

3. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. 
If dependencies have no patch, replace it with an alternative, or wait for the library to be patched.

    NOTE: If any npm packages are updated, update the node cache version in the circle config. 

3. `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).

    - Once verification is complete, you will need to rebuild the docker image and push it to ECR.

4. `docker`: Update [docker base image](https://hub.docker.com/r/cypress/base/tags?page=1&name=14.) if an update is available for the current node version the project is using.

## Validating Updates
-  After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
    - Be sure the deploy runs a migration to verify the updates do not affect the migration workflow.

