#  Migration Steps
1) If this is the first time running a blue/green deployment on the environment, attempt to run a deploy on circle. The deploy will fail on the deploy web-api terraform step. In order to resolve the error, run `setup-s3-deploy-files.sh`.
2) If migration is necessary:
	a. Update migrate value in `efcms-deploy-<ENV>` table to `true`.
	b. Update table name in `get-destination-table.sh`, `get-source-table.sh`, `get-destination-elasticsearch.sh`, `get-source-elasticsearch.sh`
3) If a new dynamo table and elasticsearch domain is necessary, duplicate the modules found in `web-api/terraform/template/main.tf`. Be sure to update the version number at the end of the module names, `table_name`, and `domain_name`. Do not delete the old modules.
4) Run a deploy in circle.
5) Verify the new application works at: 
	- https://<DEPLOYED_COLOR>-dev.ustc-case-mgmt.flexion.us
	- https://app-<DEPLOYED_COLOR>-dev.ustc-case-mgmt.flexion.us
6) Destroy the migration infrastructure to turn off the live streams
	`DESTINATION_TABLE=b SOURCE_TABLE=a STREAM_ARN=abc npm run destroy:migration -- <DEPLOYED_ENV>`