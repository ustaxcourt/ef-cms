#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CreateSecretCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  getLowerEnvAccountId,
  getLowerEnvSsoRoleId,
  getRepoName,
} from './createSecretsHelpers';

const scriptConfig: ScriptConfig = {
  description:
    'create-account-secrets - Creates the "account_deploy" secrets in AWS Secrets Manager',
  environment: {
    // not using ACCESS_KEY_ID; we haven't deployed the dawson_dev role yet
    awsProfile: 'AWS_PROFILE',
  },
  parameters: {
    baseDomain: {
      description: 'Base domain without subdomain',
      long: 'domain',
      required: true,
      type: 'string',
    },
    env: {
      required: true,
      type: 'string',
    },
    externalTrustedRoleArn: {
      description:
        'ARN of an external role that is allowed to assume the dawson_dev role in this account',
      long: 'external-trusted-role-arn',
      type: 'string',
    },
    logExpirationDays: {
      default: '30',
      long: 'log-expiration-days',
      transform: 'number',
      type: 'string',
    },
    opensearchLogsEngineVersion: {
      default: 'OpenSearch_2.19',
      long: 'opensearch-logs-engine-version',
      type: 'string',
    },
    opensearchLogsInstanceCount: {
      default: '1',
      long: 'opensearch-logs-instance-count',
      transform: 'number',
      type: 'string',
    },
    opensearchLogsInstanceType: {
      default: 't2.small.search',
      long: 'opensearch-logs-instance-type',
      type: 'string',
    },
    opensearchLogsVolumeSize: {
      default: '10',
      long: 'opensearch-logs-volume-size',
      transform: 'number',
      type: 'string',
    },
    region: {
      default: 'us-east-1',
      type: 'string',
    },
    esInfoClusterSharedArn: {
      default: '',
      description:
        'ARN of info cluster opensearch (used when es_info_cluster_create is false)',
      long: 'es-info-cluster-shared-arn',
      type: 'string',
    },
    esInfoClusterSharedEndPoint: {
      default: '',
      description:
        'Endpoint of info cluster opensearch (used when es_info_cluster_create is false)',
      long: 'es-info-cluster-shared-endpoint',
      type: 'string',
    },
    esInfoClusterPrimaryEnv: {
      default: '',
      description:
        'The primary environment name for the info cluster (used to identify which environment created the cluster)',
      long: 'es-info-cluster-primary-env',
      type: 'string',
    },
    update: {
      default: false,
      type: 'boolean',
    },
  },
  // can't use requireActiveAwsSession; we haven't deployed the dawson_dev role yet
  requireActiveAwsSession: false,
};
const {
  baseDomain,
  env,
  externalTrustedRoleArn,
  logExpirationDays,
  opensearchLogsEngineVersion,
  opensearchLogsInstanceCount,
  opensearchLogsInstanceType,
  opensearchLogsVolumeSize,
  region,
  esInfoClusterSharedArn,
  esInfoClusterSharedEndPoint,
  esInfoClusterPrimaryEnv,
  update,
} = parseArgsAndEnvVars(scriptConfig) as {
  baseDomain: string;
  env: string;
  externalTrustedRoleArn: string;
  logExpirationDays: number;
  opensearchLogsEngineVersion: string;
  opensearchLogsInstanceCount: number;
  opensearchLogsInstanceType: string;
  opensearchLogsVolumeSize: number;
  region: string;
  esInfoClusterSharedArn: string;
  esInfoClusterSharedEndPoint: string;
  esInfoClusterPrimaryEnv: string;
  update: boolean;
};

if (env === 'prod') {
  console.log('Do not use in prod');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const repoName = await getRepoName();
  const repoSlug = repoName.replace(/[^a-z0-9]/gi, '').toLowerCase();

  const lowerEnvAccountId = await getLowerEnvAccountId();
  const lowerEnvSsoRoleId = await getLowerEnvSsoRoleId();
  const ssoRoleArn = `arn:aws:iam::${lowerEnvAccountId}:role/aws-reserved/sso.amazonaws.com/${lowerEnvSsoRoleId}`;

  const dawsonDevTrustedRoleArns: string[] = [ssoRoleArn];
  if (externalTrustedRoleArn) {
    dawsonDevTrustedRoleArns.push(externalTrustedRoleArn);
  }
  const createInfoCluster = (
    esInfoClusterSharedArn && esInfoClusterSharedEndPoint
  );
  const accountSecrets: Record<string, any> = {
    COGNITO_SUFFIX: `${repoSlug}-${env}`,
    // eslint-disable-next-line no-useless-escape
    DAWSON_DEV_TRUSTED_ROLE_ARNS: `[\\\"${dawsonDevTrustedRoleArns.join('\\\",\\\"')}\\\"]`,
    EFCMS_DOMAIN: `${env}.${repoName}.${baseDomain}`,
    ES_LOGS_ENGINE_VERSION: opensearchLogsEngineVersion,
    // eslint-disable-next-line no-useless-escape
    LOG_GROUP_ENVIRONMENTS: `[\\\"${env}\\\"]`,
    LOG_SNAPSHOT_BUCKET_NAME: `${repoSlug}-${env}-log-snapshots`,
    NUM_DAYS_TO_KEEP_LOGS: logExpirationDays,
    ES_INFO_CLUSTER_CREATE: createInfoCluster.toString(),
  };
  
  if (esInfoClusterPrimaryEnv) {
    accountSecrets.ES_INFO_CLUSTER_PRIMARY_ENV = esInfoClusterPrimaryEnv;
  }
  if (createInfoCluster) {
    accountSecrets.ES_LOGS_EBS_VOLUME_SIZE_GB = opensearchLogsVolumeSize;
    accountSecrets.ES_LOGS_INSTANCE_COUNT = opensearchLogsInstanceCount;
    accountSecrets.ES_LOGS_INSTANCE_TYPE = opensearchLogsInstanceType;
    console.log('Creating new Info Opensearch cluster');
  } else {
    if (!esInfoClusterSharedArn || !esInfoClusterSharedEndPoint) {
      console.error(
        'ERROR: When using shared Info Opensearch cluster, both arn and endpoint must be provided',
      );
      process.exit(1);
    }
    accountSecrets.ES_INFO_CLUSTER_SHARED_ARN = esInfoClusterSharedArn;
    accountSecrets.ES_INFO_CLUSTER_SHARED_ENDPOINT =
      esInfoClusterSharedEndPoint;
    accountSecrets.ES_LOGS_EBS_VOLUME_SIZE_GB = 10;
    accountSecrets.ES_LOGS_INSTANCE_COUNT = 1;
    accountSecrets.ES_LOGS_INSTANCE_TYPE = 'm5.large.search';
    console.log(
      `Using shared Info Opensearch cluster: arn ${esInfoClusterSharedArn} endpoint ${esInfoClusterSharedEndPoint}`,
    );
  }

  const secretsClient = new SecretsManagerClient({ region });
  if (update) {
    const putSecretValueCommand = new PutSecretValueCommand({
      SecretId: 'account_deploy',
      SecretString: JSON.stringify(accountSecrets),
    });
    await secretsClient.send(putSecretValueCommand);
  } else {
    const createSecretCommand = new CreateSecretCommand({
      Description: `Environment variables for AWS account-specific deploy`,
      Name: 'account_deploy',
      SecretString: JSON.stringify(accountSecrets),
    });
    await secretsClient.send(createSecretCommand);
  }
})();
