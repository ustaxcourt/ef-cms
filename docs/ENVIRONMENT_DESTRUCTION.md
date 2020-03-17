# Environment Destruction

To destroy an environment that was previously created and deployed:

1. In the AWS console, delete the DynamoDB tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

2. Empty and delete the S3 buckets for the environment in both us-east-1 and us-west-1. There should be a total of 10 S3 buckets to empty and delete.

3. Delete Lambda function associations from "ui" and "ui-public" CloudFront distributions.

4. Manually delete the custom domain names inside the api gateway for `efcms-[ENV].ustc-case-mgmt.flexion.us` and `efcms-[ENV].ustc-case-mgmt.flexion.us` in both us-east-1 and us-west-1.

5. Using the Google Chrome extension SAML to AWS STS Keys, locally set AWS access keys for an AWS admin user. (Note: if `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` for the CircleCI user role are set in your local environment, they will need to be unset before running these scripts.)

6. Destroy web-client: `cd web-client/terraform/main && ../bin/environment-destroy.sh [ENV]`. An expected error will occur:
```* module.environment.aws_lambda_function.header_security_lambda (destroy): 1 error(s) occurred:

* aws_lambda_function.header_security_lambda: Error deleting Lambda Function: InvalidParameterValueException: Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas.
{
  Message_: "Lambda was unable to delete arn:aws:lambda:us-east-1:515554424717:function:header_security_lambda_exp:53 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas."
}
```
This Lambda function's replicas may take several hours to remove. It can be deleted from the AWS console after waiting a few hours for replication deletion.

7. Destroy web-api: `cd web-api/terraform/main && ../bin/environment-destroy.sh [ENV]`.
