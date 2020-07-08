# Continuous release process with CircleCI

Once CircleCI is configured, any merge to an environment’s branch will automatically kick off a deployment to that environment.

**There is a manual release step**, however, documented below.

## Manual deployment steps

When CircleCI runs due to code being merged, automated tests run first, and if they are successful, automated deploy begins. **This presents a race condition.**

Before the automated deploy phase happens, any account-specific or environment-specific changes to the AWS IAM permissions for the CI deployer and roles needed for deploying lambdas needs to happen, or else the build may fail.

These commands are run manually as an administrator, since they provision AWS account-level resources which the automated deployment user does not have permission to change.

- **For the first deploy that happens in an AWS account, and for any subsequent changes to these resources,** the account-specific Terraform command needs to be run manually, from the branch being deployed:

  ```bash
  (cd iam/terraform/account-specific/main && ../bin/deploy-app.sh)
  ```

- **For the first deploy that happens in an environment (stg, prod, test), and for any subsequent changes to these resources,** the environment-specific Terraform command needs to be run manually, from the branch being deployed, with the name of the environment for that branch:

  ```bash
  # This command is for the stg environment specifically:
  (cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh stg)
  ```

### What to do if you aren’t fast enough

As mentioned above, this is a race condition. In order to run these commands, the code must be merged, which kicks off the automated tests and deployment. However, these commands must be run before the automated deployment starts.

If the build fails due to lambdas being unable to assume IAM roles, or the deployer encounters a permission denied error, these manual steps may not have completed in time. Re-run the CircleCI build from failed once the manual deployment steps are complete.

If the build fails for other reasons, be sure to check the [troubleshooting document](../TROUBLESHOOTING.md).
