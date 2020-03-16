# Environment Destruction

To destroy an environment that was previously created and deployed:

1. In the AWS console, delete the DynamoDB tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

2. Empty and delete the S3 buckets for the environment in both us-east-1 and us-west-1. There should be a total of 10 S3 buckets to empty and delete.

3. Delete Lambda function associations from CloudFront distributions.

4. Using the Google Chrome extension SAML to AWS STS Keys, locally set AWS access keys for an AWS admin user. (Note: if `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` for the CircleCI user role are set in your local environment, they will need to be unset before running these scripts.)

5. Destroy web-client: `cd web-client/terraform/main && ../bin/environment-destroy.sh [ENV]`

6. Destroy web-api: `cd web-api/terraform/main && ../bin/environment-destroy.sh [ENV]`
