# Environment Destruction

Follow these instructions to destroy an environment that was previously created and deployed:

1. In AWS’s [API Gateway console](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/), delete the custom domain for `efcms-[ENV].ustc-case-mgmt.example.gov` and `efcms-[ENV]-ws.ustc-case-mgmt.example.gov` in both us-east-1 and us-west-1 (replacing `example.gov` with your actual domain name).

2. In AWS’s [CloudFormation console](https://console.aws.amazon.com/cloudformation/), delete all the CloudFormation stacks in both us-east-1 and us-west-1 (both blue and green). The stacks will match the following pattern: `ef-cms-*-[ENV]` (e.g. `env-cms-*-prod`).  Simply enter the environment name in the search bar to find all of them.

3. In AWS’s [DynamoDB console](https://console.aws.amazon.com/dynamodb/), delete the tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

4. In AWS’s [Cognito console](https://console.aws.amazon.com/cognito/), delete the domain for `efcms-[ENV]`, followed by the Cognito user pool for the environment in us-east-1.

5. In AWS’s [S3 console](https://console.aws.amazon.com/s3/), empty all of the buckets for the environment. Enter `[ENV]` in the search bar to find all buckets associated with your environment.  There should be a total of 10 buckets to empty.

6. In AWS’s [CloudFront console](https://console.aws.amazon.com/cloudfront/), search for the distributions for the environment by entering `[ENV]` in the search bar. There should be one for ui and one for ui-public. For each one of those, click on it, go to the "Behaviors" tab, and edit the behavior. At the bottom of the Edit page, there is a Lambda Function Associations section. Click the `X` to delete that association.

7. If not already installed and configured, install the AWS CLI on your local system and configure it to use your IAM credentials. Then destroy web-client: `cd web-client/terraform/main && ../bin/environment-destroy.sh [ENV]`. An expected error will occur:

```
* module.environment.aws_lambda_function.header_security_lambda (destroy): 1 error(s) occurred:

* aws_lambda_function.header_security_lambda: Error deleting Lambda Function: InvalidParameterValueException: Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas.
{
  Message_: "Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas."
}
```

This Lambda function's replicas may take several hours to remove. It can be deleted from the AWS console after waiting a few hours for replication deletion.

8. Destroy web-api: `cd web-api/terraform/main && ../bin/environment-destroy.sh [ENV]`.  

If you get an error like this, you may have to contact AWS and have them remove the associations with the certificate:

```
* aws_acm_certificate.ws-us-west-1: Error deleting certificate: ResourceInUseException: Certificate arn:aws:acm:us-west-1:515554424717:certificate/9d6bbec6-c7fc-4277-87a5-fb63f2589f21 in account 515554424717 is in use.
```

If you run into this issue then you'll need to run `terraform state rm aws_cognito_user_pool_domain.main`:

```
Error: Error applying plan:

1 error(s) occurred:

* module.ef-cms_apis.aws_cognito_user_pool_domain.main (destroy): 1 error(s) occurred:

* aws_cognito_user_pool_domain.main: InvalidParameter: 1 validation error(s) found.
- minimum field size of 1, DeleteUserPoolDomainInput.UserPoolId.
```
