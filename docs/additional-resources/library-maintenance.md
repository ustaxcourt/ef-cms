# Library Maintenance

## Caveats
`Cypress`: Do not upgrade past 8.5.0 as anything above that version will cause the "Failed to connect to bus" [error](https://trello.com/c/iuq0gJ6P/1008-ci-error-failed-to-connect-to-the-bus). 

`@babel/register`: I locked it down to 7.16.5 because 7.16.7 was causing failures.

`faker`: The last stable version is actually 5.5.3 which we already have. Locked down in package.json. Do not upgrade to the problematic version 6.6.6.

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
  * If terraform needs to be updated, deploy from your machine to an experimental environment first.
