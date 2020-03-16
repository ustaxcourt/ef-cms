# Environment Destruction

To destroy an environment that was previously created and deployed:

1. In the AWS console, delete the DynamoDB tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

2. `cd web-api/terraform/main && ../bin/environment-destroy.sh [ENV]`

3. `cd web-client/terraform/main && ../bin/environment-destroy.sh [ENV]`