# Library Maintenance

## Caveats
`Cypress`: Do not upgrade past 8.5.0 as anything above that version will cause the "Failed to connect to bus" [error](https://trello.com/c/iuq0gJ6P/1008-ci-error-failed-to-connect-to-the-bus). 

`@fortawesome/free-solid-svg-icons`: v6.0.0 caused a regression with faThumbtack so it is not importable. [Github issue](https://github.com/FortAwesome/Font-Awesome/pull/18665) Leaving both this package and `fortawesome/free-regular-svg-icons` at v5.15.4 until this is patched.

`@fortawesome/fontawesome-svg-core`: upgrading from v1.2.36 to v1.3.0 causes icon sizing issues. Since it was released 2 days ago as of writing this, seems worth waiting for a patch, similar to the other @fortawesome packages.

`puppeteer-core` and `puppeteer`: locked to minor version ~13.2.0 since 13.3.0 was released a few hours ago and appears to be causing issues with various class exports.

`puppeteer-core` within `web-api/runtimes/puppeteer`: locked to v13.0.1 because that's the highest version that `chrome-aws-lambda` [supports](https://github.com/alixaxel/chrome-aws-lambda/issues/254) at the moment

## JavaScript Libraries

`npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

`npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

`npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. 
If dependencies have no patch, replace it with an alternative, or wait for the library to be patched.

## Infrastructure as Code Libraries

`Terraform`: check for updates on the Terraform site. The Terraform version can be changed with a global find/replace.
  * If there is a new version of Terraform, update all version references in the project and push to to an experimental environment to allow CircleCI to verify everything is working. 
  * Be sure to deploy the migration infrastructure and run a migration as well.
  * Once verification is complete, you will need to rebuild the docker images that use Terraform and push them to ECS.

`Docker`: Update docker base image version if applicable.

## Validating Updates
 After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
  * Perform a forced migration if a migration is not already required, in order to test that the upgrades dont break anything in the migration flow.
  * If terraform needs to be updated, deploy from your machine to an experimental environment first.

