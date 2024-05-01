# Environment-Related Troubleshooting

## Failing Pa11y Tests

Problem:

- Pa11y tests succeed locally but fail on Circle.

Solution:

- We utilize a package called `pa11y-ci` which runs tests found in the `pa11y/` directory.  These run within docker containers, but they also seem to leak memory [see this issue](https://github.com/nodejs/docker-node/issues/1096) from within Node itself.  This has resulted in the need to split our many `pa11y` tests into several more runs, each smaller in size (see `.circleci/config.yml` and the multiple steps within 'e2e-pa11y' job).  If a `pa11y` test repeatedly succeed when running locally but frequently fail within the CI docker container, you may be hitting a memory constraint and should consider further splitting up your `pa11y` test tasks.

## Repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 Not Found

Problem:  

```text
Error response from daemon: repository xxxxx.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1 not found
```

Solution:

- This issue is due to a deletion of our ECR repository. We aren't sure the cause of the deletion yet, but the fix is to recreate the ECR repository (name it `ef-cms-us-east-1`) and run `./docker-to-ecr.sh` to rebuild the Docker container and send it to the repository.
  
## IAM permissions errors

Problem:

- The deploy fails due to a permissions error with AWS.

Solution:

- It's likely that the IAM permissions within that environment have not been updated. Do so like such, substituting the environment in question for `stg`:

  ```text
  cd iam/terraform/account-specific/main && ../bin/deploy-app.sh && cd ../../environment-specific/main && ../bin/deploy-app.sh stg
  ```

## Issues with terraform deploy - first time

Problem:
  
```text
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

```text
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

```text
Web API Terraform stderr:  * module.ef-cms_apis.aws_cognito_user_pool_domain.main (destroy): 1 error occurred:

Web API Terraform stderr:  * aws_cognito_user_pool_domain.main: InvalidParameter: 1 validation error(s) found.

Web API Terraform stderr:  - minimum field size of 1, DeleteUserPoolDomainInput.UserPoolId.
```

Solution:

- If this error is seen during environment destruction, run `terraform state rm module.ef-cms_apis.aws_cognito_user_pool_domain.main` to delete the terraform state associated with that resource.

## Terraform Deploy: Provided certificate does not exist

Problem:

```text
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

```text
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

    ```text
    Lambda was unable to decrypt the environment variables because KMS access was denied. Please check the function’s KMS key settings. KMS Exception: AccessDeniedExceptionKMS Message: The ciphertext refers to a customer master key that does not exist, does not exist in this region, or you are not allowed to access.
    ```

Solution:

- Found these references of this being an open and unsolved issue, with the only solution that has worked being to delete the app (in this case deleting the Lambda Function) and redeploying.

  - [Lambda was unable to decrypt the environment variables because KMS access was denied #1103](https://github.com/aws/chalice/issues/1103)
  - [Unable to invoke Lambda with environment variables due to KMS AccessDeniedException #6352](https://github.com/terraform-providers/terraform-provider-aws/issues/6352)

## Route53 Record Already Exists

Problem:

```text
Error: [ERR]: Error building changeset: InvalidChangeBatch: [Tried to create resource record set [name='_243f260ea635a6dffe0db2c6cc1c1158.*************************.', type='CNAME'] but it already exists]
```

Solution:

- Manually delete the Route53 record and rerun the deploy.

## IAM Role already exists

Problem:

```text
Error: Error creating IAM Role migration_role_<ENV>: EntityAlreadyExists: Role with name migration_role_<ENV> already exists.
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

Problem:

- Practitioner Search: should be able to search for a practitioner by name failing on Circle

Solution:

- Ensure your environment is setup properly or switch to the environment using the [environment switcher](docs/additional-resources/environment-switcher.md) and then run the `./reindex-elasticsearch.sh` script.

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

## Error deleting Lambda@Edge function

Problem:

- Replicas are still deleting

Solution:

- Wait an hour and then try again

## User not found in persistence

Problem:

- Smoketests are failing, when inspecting the network tab, the request to /users fails with error message

  ```text
  User <UUID> not found in persistence.
  ```

Solution:

- This solution should only be used on non-prod environments. Clear the dynamo tables and recreate the users and judges.

  ```bash
  . ./scripts/user/setup-test-users.sh "${ENV}"
  ```

  ```bash
  ENV=exp5 FILE_NAME=judge_users.csv ./scripts/circleci/judge/bulk-import-judge-users.sh
  ```

## AxiosError: Request failed with status code 403 on Test Users Setup

Problem:

- After an environment is torn down and it's being deployed again fresh, on running Test Users Setup, the url that axios posts to must include the DEPLOYING_COLOR. This is likely because the API gateway mapping record doesn't exist between the DEPLOYING_COLOR and the generic api record since `switch-colors` has not been run yet.

Solution:

- In `createDawsonUser`, make sure that the url that is passed to axios includes the DEPLOYING_COLOR. For example, `https://api-green.${EFCMS_DOMAIN}/users`.

## Docker Image Deploy

Problem:

- While running `npm run deploy:ci-image` the `apt-get update` command may present an error indicating that the debian distro is not signed properly. It will look like the following:

  ```text
  > [ 5/16] RUN apt-get -o Acquire::Check-Valid-Until=false update:
  #8 0.490 Get:1 http://security.debian.org/debian-security buster/updates InRelease [73.5 kB]
  #8 0.493 Get:2 http://deb.debian.org/debian buster InRelease [122 kB]
  #8 0.535 Get:3 http://deb.debian.org/debian buster-updates InRelease [56.6 kB]
  #8 0.607 Err:1 http://security.debian.org/debian-security buster/updates InRelease
  #8 0.607   At least one invalid signature was encountered.
  #8 0.682 Err:2 http://deb.debian.org/debian buster InRelease
  #8 0.682   At least one invalid signature was encountered.
  #8 0.694 Get:4 http://ftp.debian.org/debian stretch-backports InRelease [99.9 kB]
  #8 0.755 Err:3 http://deb.debian.org/debian buster-updates InRelease
  #8 0.755   At least one invalid signature was encountered.
  #8 0.826 Err:4 http://ftp.debian.org/debian stretch-backports InRelease
  #8 0.826   At least one invalid signature was encountered.
  #8 0.835 Reading package lists...
  #8 0.850 W: GPG error: http://security.debian.org/debian-security buster/updates InRelease: At least one invalid signature was encountered.
  #8 0.850 E: The repository 'http://security.debian.org/debian-security buster/updates InRelease' is not signed.
  #8 0.850 W: GPG error: http://deb.debian.org/debian buster InRelease: At least one invalid signature was encountered.
  #8 0.850 E: The repository 'http://deb.debian.org/debian buster InRelease' is not signed.
  #8 0.850 W: GPG error: http://deb.debian.org/debian buster-updates InRelease: At least one invalid signature was encountered.
  #8 0.850 E: The repository 'http://deb.debian.org/debian buster-updates InRelease' is not signed.
  #8 0.851 W: GPG error: http://ftp.debian.org/debian stretch-backports InRelease: At least one invalid signature was encountered.
  #8 0.851 E: The repository 'http://ftp.debian.org/debian stretch-backports InRelease' is not signed.
  ------
  executor failed running [/bin/sh -c apt-get -o Acquire::Check-Valid-Until=false update]: exit code: 100
  ```

Solution:

- It may help to run `docker system prune` as suggested in [this stackoverflow answer](https://stackoverflow.com/a/65524014)
- After running that command, try running `npm run deploy:ci-image` again.

## 504 Errors

Problem:

- A DAWSON API call returns a `504` Status Code

Solution:

- These are also known as a Gateway Timeout. In our case, it usually means that AWS Lambda took too long (29 seconds) to execute. It could also mean that AWS is experiencing a service disruption. You have a few options to try and troubleshoot:

  - Refer to the [AWS Service Dashboard](https://health.aws.amazon.com/health/status) to check if there are any current issues with AWS Lambda in `us-east-1` or `us-west-1`. It's not uncommon for them to be experiencing issues and not reporting them.
  - Query Kibana to see the APIs that are returning a Status Code of 504. If it's an unusual amount of them, higher than historical activity, then it's quite likely that there's an AWS outage. Consider opening up a ticket with AWS Support. Ideally, we shouldn't be seeing any.
  - If it's consistently the same endpoint, then perhaps one of its downstream dependencies is not healthy (e.g., DynamoDB for database reads or writes).
  - Navigate to the current color's `api_<env>_<color>` Lambda, and click the Monitor tab. See if you notice any Lambda invocations that are hitting the 29s limit.
  - Go to Cloudwatch > Log Insights, and query the log group for reports that mention a duration greater than 28000ms:

    ```text
    fields @timestamp, @message
    | filter @duration > 28000
    | sort @timestamp desc
    | limit 20
    ```

    Here you can hopefully find some record or Lambda Request ID to track down to see any other information that may have been logged by that invocation.

## 502 Errors

- A DAWSON API call returns a `502` Status Code

Solution:

- These are also known as an **Internal Server Error**. In our case, it often means that Lambda is trying to return too much information (6mb) to API Gateway. When each request ends, Lambda logs `Request ended: ${req.method} ${req.url}` and additional context that includes the `response.responseSize`. If those are approaching 6 megabytes, this is likely the cause of the problem. We will need to refactor our endpoint to return less information to the client via API Gateway. Does the client really need all of that information to do its job? Perhaps we can write a Data Transfer Object (DTO) to reduce what we return to the client and keep the `responseSize` in check.
- Additionally, we include the `request.url` in the API Gateway logs for each request. In Kibana, filter `response.statusCode` = `502`, and find the log entries to identify the offending URLs by `request.url` or the Lambda invocation by `requestId.lambda` to attain additional information about what Lambda returned to API Gateway that triggered the `502` error.
- `Amazon-Route53-Health-Check-Service` can also trigger a `502` status code if it fails. Most of these failures are false positives as AWS is throttling our requests for whether an AWS Service is healthy. [opex card to address](https://trello.com/c/wcGB8sO5/1124-amazon-route53-health-check-service-are-returning-erroneous-502-errors-because-they-are-throttling-our-requests)
