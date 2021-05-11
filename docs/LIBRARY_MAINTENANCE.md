# Library Maintenance

## JavaScript Libraries

`npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

`npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

`npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. 
If dependencies have no patch, replace it with an alternative, or wait for the library to be patched.

## Infrastructure as Code Libraries

`Terraform`: check for updates on the Terraform site. The Terraform version can be changed with a global find/replace.

`Docker`: Update docker base image version if applicable.

### After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
  * If terraform needs to be updated, deploy locally to an exp environment first. 
