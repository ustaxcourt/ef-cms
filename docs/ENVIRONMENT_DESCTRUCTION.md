# Environment Desctruction

To destroy an environment that was previously created and deployed:

1. In the AWS console, delete the DynamoDB tables for the environment in both us-east-1 and us-west-1. There should be two tables in us-east-1 and one table in us-west-1.

2. possibly need to run aws-script to get admin user keys? TODO

3. `cd web-api/terraform/main && ../bin/deploy-app.sh [ENV]`

4. `cd web-client/terraform/main && ../bin/deploy-app.sh [ENV]`