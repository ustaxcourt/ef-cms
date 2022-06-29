# Environment-Related Troubleshooting

## Failing Pa11y Tests
Problem: 
- Pa11y tests succeed locally but fail on Circle.

Solution: 
- We utilize a package called `pa11y-ci` which runs tests found in the `pa11y/` directory.  These run within docker containers, but they also seem to leak memory [see this issue](https://github.com/nodejs/docker-node/issues/1096) from within Node itself.  This has resulted in the need to split our many `pa11y` tests into several more runs, each smaller in size (see `.circleci/config.yml` and the multiple steps within 'e2e-pa11y' job).  If a `pa11y` test repeatedly succeed when running locally but frequently fail within the CI docker container, you may be hitting a memory constraint and should consider further splitting up your `pa11y` test tasks.


## Repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 Not Found
Problem:  
```
Error response from daemon: repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 not found
```
Solution: 
- This issue is due to a deletion of our ECR repository. We aren't sure the cause of the deletion yet, but the fix is to recreate the ECR repository (name it `ef-cms-us-east-1`) and run `./docker-to-ecr.sh` to rebuild the Docker container and send it to the repository.
  
## IAM permissions errors
Problem: 
- The deploy fails due to a permissions error with AWS.

Solution:
- It's likely that the IAM permissions within that environment have not been updated. Do so like such, substituting the environment in question for `stg`:

  ```
  cd iam/terraform/account-specific/main && ../bin/deploy-app.sh && cd ../../environment-specific/main && ../bin/deploy-app.sh stg
  ```


## Issues with terraform deploy - first time
Problem:
  ```
  Error: Error applying plan:

  2 error(s) occurred:

  * module.environment.aws_cloudfront_distribution.public_distribution: 1 error(s) occurred:

  * aws_cloudfront_distribution.public_distribution: error creating CloudFront Distribution: InvalidViewerCertificate: The specified SSL certificate doesn't exist, isn't in us-east-1 region, isn't valid, or doesn't include a valid certificate chain.
	status code: 400, request id: 88163d5d-bb9b-43db-abd7-57ba923cb103
  * module.environment.aws_cloudfront_distribution.distribution: 1 error(s) occurred:

  * aws_cloudfront_distribution.distribution: error creating CloudFront Distribution: InvalidViewerCertificate: The specified SSL certificate doesn't exist, isn't in us-east-1 region, isn't valid, or doesn't include a valid certificate chain.
	status code: 400, request id: 8fb7c31a-8e7a-4608-ac7b-10d118deae59
  ```
Solution: 
- Rerun the build.


## Issues with deleting lambdas during environment teardown
Problem:
  ```
  Error: Error deleting replication function:security_header_function_exp2
  ```

Solution: 
- The lambda function is replicated to all edge locations and the deletion has to propagate throughout. Manually delete the specified lambda(s) in AWS OR wait about an hour and try running the teardown again.


## Elasticsearch total field limit
Problem:
- `[illegal_argument_exception] Limit of total fields [4000] in index [efcms] has been exceeded`

Solution:
- This error often occurs when we are indexing too many dynamic keys or nested objects with Elasticsearch and reach our total field limit. To filter data from indexing, add fields or keys to the filtering functions in `processStreamRecordsInteractor.js`.


## Removing Cognito user pool during environment destruction
Problem: 
  ```
  Web API Terraform stderr:  	* module.ef-cms_apis.aws_cognito_user_pool_domain.main (destroy): 1 error occurred:

  Web API Terraform stderr:  	* aws_cognito_user_pool_domain.main: InvalidParameter: 1 validation error(s) found.

  Web API Terraform stderr:  - minimum field size of 1, DeleteUserPoolDomainInput.UserPoolId.
  ```

Solution:
- If this error is seen during environment destruction, run `terraform state rm module.ef-cms_apis.aws_cognito_user_pool_domain.main` to delete the terraform state associated with that resource.


## Terraform Deploy: Provided certificate does not exist
Problem: 
  ```
  Error: Error applying plan:

  1 error occurred:
	* module.ef-cms_apis.aws_apigatewayv2_domain_name.websockets_domain: 1 error occurred:
	* aws_apigatewayv2_domain_name.websockets_domain: error creating API Gateway v2 domain name: BadRequestException: The provided certificate does not exist.
  ```

Solution:
- This error happens due to the time it takes for AWS to get their certificates synchronized / checked. When this happens, re-run the deploy.


## Create Cognito Users (CI deploy)
Problem: 
- When updating the environment variables, `ZONE_NAME` and `EFCMS_DOMAIN`, we ran into this error:
  ```
  An error occurred (UsernameExistsException) when calling the SignUp operation: An account with the given email already exists.
  An error occurred (NotAuthorizedException) when calling the AdminConfirmSignUp operation: User cannot be confirmed. Current status is CONFIRMED
  curl: (3) URL using bad/illegal format or missing URL
  ```

Solution: 
- This happened when duplicate API gateways (i.e., `gateway_api_$ENV`) were created due to a Terraform state sync problem.

## LogsToElasticSearch_info lambda erroring out without trying to post to Elasticsearch
Problem:
- We were observing errors in the `LogsToElasticSearch_info` Lambda monitoring tab; however, we weren't seeing any errors getting logged. Created a test function in the console in order to call the Lambda and observed this error:
- Calling the invoke API action failed with this message:
  ```
  Lambda was unable to decrypt the environment variables because KMS access was denied. Please check the function’s KMS key settings. KMS Exception: AccessDeniedExceptionKMS Message: The ciphertext refers to a customer master key that does not exist, does not exist in this region, or you are not allowed to access.
  ```

Solution: 
- Found these references of this being an open and unsolved issue, with the only solution that has worked being to delete the app (in this case deleting the Lambda Function) and redeploying.
  * https://github.com/aws/chalice/issues/1103
  * https://github.com/terraform-providers/terraform-provider-aws/issues/6352

## Route53 Record Already Exists
Problem: 
  ```
  Error: [ERR]: Error building changeset: InvalidChangeBatch: [Tried to create resource record set [name='_243f260ea635a6dffe0db2c6cc1c1158.*************************.', type='CNAME'] but it already exists]
  ```
    
Solution: 
- Manually delete the Route53 record and rerun the deploy.


## IAM Role already exists
Problem:
  ```
  Error: Error creating IAM Role migration_role_<ENV>: EntityAlreadyExists: Role with name 		migration_role_<ENV> already exists.
		status code: 409, request id: ***********

	on migration.tf line 1, in resource "aws_iam_role" "migration_role":
	1: resource "aws_iam_role" "migration_role" {
  ```
Solution: 
- Delete the role in the AWS IAM console and rerun:

	```bash
	npm run deploy:environment-specific <ENV>
	````


## Failing smoketests
Problem:
- Smoketests are failing on Circle

Solution: 
- When this is run for the first time on a new environment, the smoke tests may fail for up to an hour after the initial deploy due to the header security lambda redeploying to all edge locations. To resolve, wait an hour and rerun the smoke tests.


## Unable to delete cognito user pool
Problem: 
- The cognito user pools have `lifecycle.prevent_destroy` set to true, so you have to manually delete them via the AWS console. You will have to delete both `efcms-<ENV>` and `efcms-irs-<ENV>` pools.

Solution: 
- Go to Cognito
- Select "Manage User Pools"
- Select the user pool 
- Click on App Integration > Domain Name
- Click 'Delete Domain'
- Go back to 'General Settings' for the cognito pool 
- Click 'Delete Pool'


## Error archiving file /template/lambdas/dist/<some-file.js>
Problem: 
- Files built by webpack during the deploy are not available

Solution: 
- Run the web-api webpack build to bundle the files into the expected folder

    ```bash
    npm run build:lambda:api
    ```


## Error deleting Lambda@Edge function
Problem: 
- Replicas are still deleting

Solution: 
- Wait an hour and then try again


## User not found in persistence
Problem: 
- Smoketests are failing, when inspecting the network tab, the request to /users fails with error message 
  ```
  User <UUID> not found in persistence.
  ```

Solution: 
- This solution should only be used on non-prod environments. Clear the dynamo tables and recreate the users and judges.
    ```bash
    . ./shared/admin-tools/user/setup-test-users.sh "${ENV}"
    ```
    ```bash
    ENV=exp5 FILE_NAME=judge_users.csv ./scripts/bulk-import-judge-users.sh
    ```

## AxiosError: Request failed with status code 403 on Test Users Setup
Problem:
- After an environment is torn down and it's being deployed again fresh, on running Test Users Setup, the url that axios posts to must include the DEPLOYING_COLOR. This is likely because the API gateway mapping record doesn't exist between the DEPLOYING_COLOR and the generic api record since `switch-colors` has not been run yet.

Solution:
- In `createDawsonUser`, make sure that the url that is passed to axios includes the DEPLOYING_COLOR. For example, `https://api-green.${EFCMS_DOMAIN}/users` instead of `https://api.${EFCMS_DOMAIN}/users`.