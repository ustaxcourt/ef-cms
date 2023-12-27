This PR includes the usual weekly dependency updates as well as upgrading the account-specific (info) ElasticSearch and environment-specific ElasticSearch clusters to the latest supported version of OpenSearch - see deploy instructions below.

Account specific:

Environment specific: 
- In the AWS console, navigate to Opensearch service and go to the enviornment's currently deployed cluster.
- Under 'Actions', click 'Upgrade'.
- Follow the required steps in the modal to upgrade to OpenSearch 1.3 from ElasticSearch 7.10.
- Wait until the cluster has finished upgrading.
- Under 'Actions', click 'Upgrade'.
- Follow the required steps in the modal to upgrade to OpenSearch 2.11 from OpenSearch 1.3.
- Wait until the cluster has finished upgrading.
- In a terminal window, use the environment switcher to source your environment to the deploying environment.
- Run the following command - replacing <SOURCE_TABLE_VERSION> with alpha or beta and replacing <ENVIRONMENT> (ex - experimental2 would be 'exp2'):
    `terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"`
- Run the following command:
    `terraform state rm module.ef-cms_apis.module.elasticsearch_<SOURCE_TABLE_VERSION>[0].aws_elasticsearch_domain.efcms-search`
- Run the following command:
    `terraform import module.ef-cms_apis.module.elasticsearch_<SOURCE_TABLE_VERSION>[0].aws_opensearch_domain.efcms-search efcms-search-<ENVIRONMENT>-<SOURCE_TABLE_VERSION>`
- Kick off a CircleCI deploy.

Migration deploy (before OpenSearch update):

Deploy (after OpenSearch update):