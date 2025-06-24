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
import { getLowerEnvAccountId, getRepoName } from './createSecretsHelpers';
import { makeNewPassword } from '../user/make-new-password';

const scriptConfig: ScriptConfig = {
  description:
    'create-env-secrets - Creates the "[env]_deploy" secrets in AWS Secrets Manager',
  environment: {
    // not using ACCESS_KEY_ID; we haven't deployed the dawson_dev role yet
    awsProfile: 'AWS_PROFILE',
  },
  parameters: {
    adminUserEmail: {
      default: 'ustcadmin@example.com',
      long: 'admin-user-email',
      type: 'string',
    },
    baseDomain: {
      description: 'Base domain without subdomain',
      long: 'domain',
      required: true,
      type: 'string',
    },
    dynamsoftProductKeys: {
      default: 'noop',
      long: 'dynamsoft-product-keys',
      type: 'string',
    },
    emailDmarcPolicy: {
      long: 'email-dmarc-policy',
      required: true,
      type: 'string',
    },
    enableDynamsoft: {
      default: false,
      long: 'enable-dynamsoft',
      type: 'boolean',
    },
    enableEmail: {
      default: false,
      long: 'enable-email',
      type: 'boolean',
    },
    enableHealthChecks: {
      default: false,
      long: 'enable-health-checks',
      type: 'boolean',
    },
    env: {
      required: true,
      type: 'string',
    },
    generateSecureDefaultAccountPassword: {
      default: false,
      long: 'generate-secure-default-account-password',
      type: 'boolean',
    },
    irsSuperuserEmail: {
      long: 'irs-superuser-email',
      type: 'string',
    },
    opensearchInstanceCount: {
      default: '1',
      long: 'opensearch-instance-count',
      transform: 'number',
      type: 'string',
    },
    opensearchInstanceType: {
      default: 't2.small.search',
      long: 'opensearch-instance-type',
      type: 'string',
    },
    opensearchVolumeSize: {
      default: '10',
      long: 'opensearch-volume-size',
      transform: 'number',
      type: 'string',
    },
    postgresOriginalUsername: {
      default: 'master', // yuck
      long: 'postgres-original-username',
      type: 'string',
    },
    prodAccountId: {
      description: 'AWS account id of the production instance',
      long: 'prod-account-id',
      required: true,
      type: 'string',
    },
    prodDocumentsBucket: {
      description: 'Name of the production documents bucket',
      long: 'prod-documents-bucket',
      required: true,
      type: 'string',
    },
    rdsMaxCapacity: {
      default: '1',
      long: 'rds-max-capacity',
      // do not transform; 'number' only supports integers
      type: 'string',
    },
    rdsMinCapacity: {
      default: '0.5',
      long: 'rds-min-capacity',
      // do not transform; 'number' only supports integers
      type: 'string',
    },
    region: {
      default: 'us-east-1',
      type: 'string',
    },
    rumSampleRate: {
      default: '1',
      long: 'rum-sample-rate',
      // do not transform; 'number' only supports integers
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
  adminUserEmail,
  baseDomain,
  dynamsoftProductKeys,
  emailDmarcPolicy,
  enableDynamsoft,
  enableEmail,
  enableHealthChecks,
  env,
  generateSecureDefaultAccountPassword,
  irsSuperuserEmail,
  opensearchInstanceCount,
  opensearchInstanceType,
  opensearchVolumeSize,
  postgresOriginalUsername,
  prodAccountId,
  prodDocumentsBucket,
  rdsMaxCapacity,
  rdsMinCapacity,
  region,
  rumSampleRate,
  update,
} = parseArgsAndEnvVars(scriptConfig) as {
  adminUserEmail: string;
  baseDomain: string;
  dynamsoftProductKeys: string;
  emailDmarcPolicy: string;
  enableDynamsoft: boolean;
  enableEmail: boolean;
  enableHealthChecks: boolean;
  env: string;
  generateSecureDefaultAccountPassword: boolean;
  irsSuperuserEmail: string;
  opensearchInstanceCount: number;
  opensearchInstanceType: string;
  opensearchVolumeSize: number;
  postgresOriginalUsername: string;
  prodAccountId: string;
  prodDocumentsBucket: string;
  rdsMaxCapacity: string;
  rdsMinCapacity: string;
  region: string;
  rumSampleRate: string;
  update: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const repoName = await getRepoName();
  const repoSlug = repoName.replace(/[^a-z0-9]/gi, '').toLowerCase();

  const adminUserPassword = makeNewPassword();
  const defaultAccountPass = generateSecureDefaultAccountPassword
    ? makeNewPassword()
    : 'Testing1234$';
  const lowerEnvAccountId = await getLowerEnvAccountId();
  const postgresOriginalPassword = makeNewPassword(
    ['uppercase', 'lowercase', 'numbers'],
    42,
  );

  const envSecrets = {
    COGNITO_SUFFIX: `${repoSlug}_${env}`,
    DATABASE_NAME: `${env}_dawson`,
    DEFAULT_ACCOUNT_PASS: defaultAccountPass,
    DISABLE_EMAILS: !enableEmail ? 'true' : 'false',
    DYNAMSOFT_PRODUCT_KEYS: dynamsoftProductKeys,
    EFCMS_DOMAIN: `${env}.${repoName}.${baseDomain}`,
    EMAIL_DMARC_POLICY: emailDmarcPolicy,
    ENABLE_HEALTH_CHECKS: enableHealthChecks ? 1 : 0,
    ENV: env,
    ES_INSTANCE_COUNT: opensearchInstanceCount,
    ES_INSTANCE_TYPE: opensearchInstanceType,
    ES_VOLUME_SIZE: opensearchVolumeSize,
    IRS_SUPERUSER_EMAIL:
      irsSuperuserEmail || `service.agent.${env}@example.com`,
    IS_DYNAMSOFT_ENABLED: enableDynamsoft ? 1 : 0,
    LOWER_ENV_ACCOUNT_ID: lowerEnvAccountId,
    POSTGRES_MASTER_PASSWORD: postgresOriginalPassword,
    POSTGRES_MASTER_USERNAME: postgresOriginalUsername,
    POSTGRES_USER: `${env}_dawson`,
    PROD_DOCUMENTS_BUCKET_NAME: prodDocumentsBucket,
    PROD_ENV_ACCOUNT_ID: prodAccountId,
    RDS_MAX_CAPACITY: rdsMaxCapacity,
    RDS_MIN_CAPACITY: rdsMinCapacity,
    RUM_SAMPLE_RATE: rumSampleRate,
    USTC_ADMIN_PASS: adminUserPassword,
    USTC_ADMIN_USER: adminUserEmail,
  };

  const secretsClient = new SecretsManagerClient({ region });
  if (update) {
    const putSecretValueCommand = new PutSecretValueCommand({
      SecretId: `${env}_deploy`,
      SecretString: JSON.stringify(envSecrets),
    });
    await secretsClient.send(putSecretValueCommand);
  } else {
    const createSecretCommand = new CreateSecretCommand({
      Description: `Environment variables for the ${env} environment`,
      Name: `${env}_deploy`,
      SecretString: JSON.stringify(envSecrets),
    });
    await secretsClient.send(createSecretCommand);
  }
})();
