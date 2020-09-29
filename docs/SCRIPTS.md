# Tech Lead Scripts

The following scripts are used for local development and managing deployments to AWS. Valid AWS admin credentials are required.

|Command|Description|
|----------------------------|------------------------------------------------------------------------------------------|
|`reset-dependencies.sh` |Removes all downloaded dependencies and reinstalls everything from scratch. |
|`npm run deploy:account-specific` |Prepares AWS for a deployment to an AWS account. |
|`npm run deploy:environment-specific -- ENV`|Prepares AWS for a deployment to an environment.|
|`npm run init:api -- ENV`|Initializes the API code in your workspace to AWS.|
|`npm run init:ui -- ENV`|Initializes the UI code in your workspace to AWS.|
|`npm run deploy:api -- ENV`|Deploys the API code in your workspace to AWS.|
|`npm run deploy:ui -- ENV`|Deploys the UI code in your workspace to AWS.|
|`npm run reset-cases ENV DYNAMO_TABLE_NAME ELASTICSEARCH_ENDPOINT`|Removes all cases from DynamoDB and ElasticSearch for an environment in AWS.|
|`npm run reindex:elasticsearch -- ENV DYNAMO_TABLE_NAME ELASTICSEARCH_ENDPOINT`|Deletes and recreates ElasticSearch indices and reindexes all DynamoDB records for an environment in AWS.|
|`npm run destroy:ENV`|Removes all infrastructure resources and data for an environment in AWS.|
