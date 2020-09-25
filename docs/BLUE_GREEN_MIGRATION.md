#  Blue-Green Deploy and Migration Steps
1) If this is the first time running a blue/green deployment on the environment:
  a. Run `npm run deploy:environment-specific <ENV>` and `npm run deploy:account-specific` if it has not already been run for the account 
  b. Delete the environment's lambda S3 bucket and 4 UI S3 buckets (`app.<ENV>.<ZONE_NAME>`, `<ENV>.<ZONE_NAME>`, `app-failover.<ENV>.<ZONE_NAME>`, and `failover.<ENV>.<ZONE_NAME>`)
  c. Attempt to run a deploy on circle. The deploy will fail on the deploy web-api terraform step. In order to resolve the error, run `setup-s3-deploy-files.sh`.
2) If migration is necessary:
	a. Run the following command to set the environment's migrate flag to true:
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"true"}}'```
	b. Update table name in `get-destination-table.sh`, `get-source-table.sh`, `get-destination-elasticsearch.sh`, `get-source-elasticsearch.sh`
3) If a new dynamo table and elasticsearch domain is necessary, duplicate the modules found in `web-api/terraform/template/main.tf`. Be sure to update the version number at the end of the module names, `table_name`, and `domain_name`. Do not delete the old modules.
4) Run a deploy in circle.
5) Verify the new application works at: 
	- https://<DEPLOYED_COLOR>-dev.ustc-case-mgmt.flexion.us
	- https://app-<DEPLOYED_COLOR>-dev.ustc-case-mgmt.flexion.us
6) Destroy the migration infrastructure to turn off the live streams
	`DESTINATION_TABLE=b SOURCE_TABLE=a STREAM_ARN=abc npm run destroy:migration -- <DEPLOYED_ENV>`

## Errors You May Encounter
### AWS-related
#### Route53 Error
```
Error: [ERR]: Error building changeset: InvalidChangeBatch: [Tried to create resource record set [name='_243f260ea635a6dffe0db2c6cc1c1158.*************************.', type='CNAME'] but it already exists]
```
Manually delete the Route53 record and rerun the deploy.


#### IAM Role already exists
```
Error: Error creating IAM Role migration_role_<ENV>: EntityAlreadyExists: Role with name 		migration_role_<ENV> already exists.
	status code: 409, request id: ***********

  on migration.tf line 1, in resource "aws_iam_role" "migration_role":
   1: resource "aws_iam_role" "migration_role" {
   ```
Delete the role in the AWS IAM console.