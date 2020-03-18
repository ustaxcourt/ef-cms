# Environment Destruction

To destroy an environment that was previously created and deployed:

1. go into the ApiGateway console in the AWS UI, and delete the custom domain for `efcms-[ENV].ustc-case-mgmt.flexion.us` and `efcms-[ENV]-ws.ustc-case-mgmt.flexion.us` in both us-east-1 and us-west-1

2. go into the CloudFormation console in the AWS UI, and delete all the CloudFormation stacks in both us-east-1 and us-west-1 (blue and green).  The stacks will match the following pattern: `ef-cms-*-[ENV]`.  Simply put `[ENV]` inside the search bar

3. In the AWS console, delete the DynamoDB tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

4. In the AWS console, delete the Cognito domain for `efcms-[ENV]`, followed by the cognito user pool for the environment in us-east-1.

5. Empty all of the S3 buckets for the environment. Search for `[ENV]` in the search bar to find all associated with your environment.  There should be a total of 10 S3 buckets to empty.

6. Delete Lambda function associations from "ui" and "ui-public" CloudFront distributions.

7. Using the Google Chrome extension SAML to AWS STS Keys, locally set AWS access keys for an AWS admin user. (Note: if `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` for the CircleCI user role are set in your local environment, they will need to be unset before running these scripts.)

8. Destroy web-client: `cd web-client/terraform/main && ../bin/environment-destroy.sh [ENV]`. An expected error will occur:
```* module.environment.aws_lambda_function.header_security_lambda (destroy): 1 error(s) occurred:

* aws_lambda_function.header_security_lambda: Error deleting Lambda Function: InvalidParameterValueException: Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas.
{
  Message_: "Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas."
}
```
This Lambda function's replicas may take several hours to remove. It can be deleted from the AWS console after waiting a few hours for replication deletion.

9. Destroy web-api: `cd web-api/terraform/main && ../bin/environment-destroy.sh [ENV]`.  You may get this error, or something similar. 
```
* aws_acm_certificate.ws-us-west-1: Error deleting certificate: ResourceInUseException: Certificate arn:aws:acm:us-west-1:515554424717:certificate/9d6bbec6-c7fc-4277-87a5-fb63f2589f21 in account 515554424717 is in use.
```
This seems to be caused by a delay between deleting the API Gateway custom domain name and the associated certificate.  It may take a couple of hours for the certificate to be disassociated with the none existing resource.  
