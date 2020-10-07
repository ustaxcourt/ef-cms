# Environment-Related Troubleshooting

## Errors You May Encounter

### Testing-related
We utilize a package called `pa11y-ci` which runs tests found in the `pa11y/` directory.  These run within docker containers, but they also seem to leak memory [see this issue](https://github.com/nodejs/docker-node/issues/1096) from within Node itself.  This has resulted in the need to split our many `pa11y` tests into several more runs, each smaller in size (see `.circleci/config.yml` and the multiple steps within 'e2e-pa11y' job).  If a `pa11y` test repeatedly succeed when running locally but frequently fail within the CI docker container, you may be hitting a memory constraint and should consider further splitting up your `pa11y` test tasks.

### AWS-related

#### ServerlessError
> ```deploy failed with ServerlessError: An error occurred: YourLambdaFunction - The role defined for the function cannot be assumed by Lambda. (Service: AWSLambdaInternal; Status Code: 400; Error Code: InvalidParameterValueException; Request ID: ae81b07e-8a75-4f98-9473-2096a5da63f9).```
If you're standing up a new environment, it is critical that you run the scripts (mentioned above and found in SETUP.md) to create Lambda roles & policies.

#### repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 not found

> ```Error response from daemon: repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 not found```
This issue is due to a deletion of our ECR repository. We aren't sure the cause of the deletion yet, but the fix is to recreate the ECR repository (name it `ef-cms-us-east-1`) and run `./docker-to-ecr.sh` to rebuild the Docker container and send it to the repository.

#### IAM permissions errors

When a deploy fails due to a permissions error with AWS, it’s likely that the IAM permissions within that environment have not been updated. Do so like such, substituting the environment in question for `stg`:

```
cd iam/terraform/account-specific/main && ../bin/deploy-app.sh && cd ../../environment-specific/main && ../bin/deploy-app.sh stg
```

### Jest and babel-jest version 25.x

These libaries are locked to version 24.x because upgrading them causes Sonarcloud to report 0% coverage.


### Issues with terraform deploy - first time

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

If this occurs, rerun the build.

### Issues with deleting lambdas during environment teardown

```
Error: Error deleting replication function:security_header_function_exp2

Solution: Manually delete the specified lambda(s) in AWS OR wait about an hour and try running the teardown again.

Reason for Error: The lambda function is replicated to all edge locations and the deletion has to propagate throughout
```

### Elasticsearch total field limit

`[illegal_argument_exception] Limit of total fields [4000] in index [efcms] has been exceeded`

This error often occurs when we are indexing too many dynamic keys or nested objects with Elasticsearch and reach our total field limit.

To filter data from indexing, add fields or keys to the filtering functions in `processStreamRecordsInteractor.js`.


### Removing Cognito user pool during environment destruction

```Web API Terraform stderr:  	* module.ef-cms_apis.aws_cognito_user_pool_domain.main (destroy): 1 error occurred:

Web API Terraform stderr:  	* aws_cognito_user_pool_domain.main: InvalidParameter: 1 validation error(s) found.

Web API Terraform stderr:  - minimum field size of 1, DeleteUserPoolDomainInput.UserPoolId.
```

If this error is seen during environment destruction, run `terraform state rm module.ef-cms_apis.aws_cognito_user_pool_domain.main` to delete the terraform state associated with that resource.


### Terraform Deploy: Provided certificate does not exist

This error happens due to the time it takes for AWS to get their certificates synchronized / checked. Example:

```
Error: Error applying plan:

1 error occurred:
	* module.ef-cms_apis.aws_apigatewayv2_domain_name.websockets_domain: 1 error occurred:
	* aws_apigatewayv2_domain_name.websockets_domain: error creating API Gateway v2 domain name: BadRequestException: The provided certificate does not exist.
```

When this happens, re-run the deploy.

### Create Cognito Users (CI deploy)

When updating the environment variables, `ZONE_NAME` and `EFCMS_DOMAIN`, we ran into this error:

```An error occurred (UsernameExistsException) when calling the SignUp operation: An account with the given email already exists.
An error occurred (NotAuthorizedException) when calling the AdminConfirmSignUp operation: User cannot be confirmed. Current status is CONFIRMED
curl: (3) URL using bad/illegal format or missing URL```

This happened when duplicate API gateways (i.e., `gateway_api_$ENV`) were created due to a Terraform state sync problem.

### LogsToElasticSearch_info lambda erroring out without trying to post to Elasticsearch

We were observing errors in the `LogsToElasticSearch_info` Lambda monitoring tab; however, we weren't seeing any errors getting logged. Created a test function in the console in order to call the Lambda and observed this error:

> Calling the invoke API action failed with this message: Lambda was unable to decrypt the environment variables because KMS access was denied. Please check the function’s KMS key settings. KMS Exception: AccessDeniedExceptionKMS Message: The ciphertext refers to a customer master key that does not exist, does not exist in this region, or you are not allowed to access.

Found these references of this being an open and unsolved issue, with the only solution that has worked being to delete the app (in this case deleting the Lambda Function) and redeploying.

* https://github.com/aws/chalice/issues/1103
* https://github.com/terraform-providers/terraform-provider-aws/issues/6352
* https://github.com/serverless/examples/issues/279
