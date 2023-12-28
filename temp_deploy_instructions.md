This PR includes the usual weekly dependency updates as well as upgrading the account-specific (info) ElasticSearch and environment-specific ElasticSearch clusters to the latest supported version of OpenSearch - see deploy instructions below.

Account specific:

Environment specific: 
- In the AWS console, navigate to Opensearch service and go to the environment's currently deployed cluster.
- Under 'Actions', click 'Upgrade'.
- Follow the required steps in the modal to upgrade to OpenSearch 1.3 from ElasticSearch 7.10.
- Wait until the cluster has finished upgrading.
- Under 'Actions', click 'Upgrade'.
- Follow the required steps in the modal to upgrade to OpenSearch 2.11 from OpenSearch 1.3.
- Wait until the cluster has finished upgrading.
- Navigate to the AWS Secrets Manager for the environment and update the value for ES_INSTANCE_TYPE to remove elastic.
    - e.g t2.small.elasticsearch -> t2.small.search
- Ensure docker is started
- In a terminal window, use the environment switcher to source your environment to the deploying environment.
- Run the following command:
    `cd web-api/terraform/main`
- Update permissions so that the script is executable with the following command:
    `chmod +x ../bin/deploy-opensearch-app.sh`
- Run the following command - replacing <SOURCE_TABLE_VERSION> (e.g. alpha or beta) with the value of that record in the environment's deploy table and replacing <ENVIRONMENT> (ex - experimental2 would be 'exp2'):
    `../bin/deploy-opensearch-app.sh <ENVIRONMENT>`
- Kick off a CircleCI deploy.