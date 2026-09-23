import { type ScriptConfig } from '../helpers/parseArgsAndEnvVars';

export const createEnvSecretsScriptConfig: ScriptConfig = {
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
    opensearchEngineVersion: {
      default: 'OpenSearch_3.7',
      long: 'opensearch-engine-version',
      type: 'string',
    },
    opensearchInstanceCount: {
      default: '1',
      long: 'opensearch-instance-count',
      transform: 'number',
      type: 'string',
    },
    opensearchInstanceType: {
      default: 't3.small.search',
      long: 'opensearch-instance-type',
      type: 'string',
    },
    opensearchVolumeSize: {
      default: '10',
      long: 'opensearch-volume-size',
      transform: 'number',
      type: 'string',
    },
    paymentPortalArn: {
      description: 'The ARN of the payment portal API',
      long: 'payment-portal-arn',
      required: true,
      type: 'string',
    },
    paymentPortalHost: {
      description: 'The URL of the payment portal API',
      long: 'payment-portal-host',
      required: true,
      type: 'string',
    },
    payGovOrigin: {
      description: 'The URL of the payment portal UI',
      long: 'pay-gov-origin',
      required: true,
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
    rdsEngineVersion: {
      default: '17.10',
      long: 'rds-engine-version',
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
    zendeskUserEmail: {
      default: 'ustczendesk@dawson.ustaxcourt.gov',
      long: 'zendesk-user-email',
      type: 'string',
    },
  },
  // can't use requireActiveAwsSession; we haven't deployed the dawson_dev role yet
  requireActiveAwsSession: false,
};

export type BuildDeployEnvSecretsParams = {
  adminUserEmail: string;
  adminUserPassword: string;
  baseDomain: string;
  defaultAccountPass: string;
  dynamsoftProductKeys: string;
  emailDmarcPolicy: string;
  enableDynamsoft: boolean;
  enableEmail: boolean;
  enableHealthChecks: boolean;
  env: string;
  irsSuperuserEmail?: string;
  opensearchEngineVersion: string;
  opensearchInstanceCount: number;
  opensearchInstanceType: string;
  opensearchVolumeSize: number;
  paymentPortalArn: string;
  paymentPortalHost: string;
  payGovOrigin: string;
  postgresOriginalPassword: string;
  postgresOriginalUsername: string;
  prodAccountId: string;
  prodDocumentsBucket: string;
  rdsEngineVersion: string;
  rdsMaxCapacity: string;
  rdsMinCapacity: string;
  repoName: string;
  rumSampleRate: string;
  zendeskUserEmail: string;
  zendeskUserPassword: string;
};

export type DeployEnvSecrets = {
  COGNITO_SUFFIX: string;
  DATABASE_NAME: string;
  DEFAULT_ACCOUNT_PASS: string;
  DISABLE_EMAILS: string;
  DYNAMSOFT_PRODUCT_KEYS: string;
  EFCMS_DOMAIN: string;
  EMAIL_DMARC_POLICY: string;
  ENABLE_HEALTH_CHECKS: number;
  ENV: string;
  ES_ENGINE_VERSION: string;
  ES_INSTANCE_COUNT: number;
  ES_INSTANCE_TYPE: string;
  ES_VOLUME_SIZE: number;
  IRS_SUPERUSER_EMAIL: string;
  IS_DYNAMSOFT_ENABLED: number;
  PAYMENT_PORTAL_ARN: string;
  PAYMENT_PORTAL_HOST: string;
  PAY_GOV_ORIGIN: string;
  POSTGRES_MASTER_PASSWORD: string;
  POSTGRES_MASTER_USERNAME: string;
  POSTGRES_USER: string;
  PROD_DOCUMENTS_BUCKET_NAME: string;
  PROD_ENV_ACCOUNT_ID: string;
  RDS_ENGINE_VERSION: string;
  RDS_MAX_CAPACITY: string;
  RDS_MIN_CAPACITY: string;
  RUM_SAMPLE_RATE: string;
  USTC_ADMIN_PASS: string;
  USTC_ADMIN_USER: string;
  USTC_ZENDESK_USER: string;
  USTC_ZENDESK_PASS: string;
};

export const buildDeployEnvSecrets = ({
  adminUserEmail,
  adminUserPassword,
  baseDomain,
  defaultAccountPass,
  dynamsoftProductKeys,
  emailDmarcPolicy,
  enableDynamsoft,
  enableEmail,
  enableHealthChecks,
  env,
  irsSuperuserEmail,
  opensearchEngineVersion,
  opensearchInstanceCount,
  opensearchInstanceType,
  opensearchVolumeSize,
  paymentPortalArn,
  paymentPortalHost,
  payGovOrigin,
  postgresOriginalPassword,
  postgresOriginalUsername,
  prodAccountId,
  prodDocumentsBucket,
  rdsEngineVersion,
  rdsMaxCapacity,
  rdsMinCapacity,
  repoName,
  rumSampleRate,
  zendeskUserEmail,
  zendeskUserPassword,
}: BuildDeployEnvSecretsParams): DeployEnvSecrets => {
  const repoSlug = repoName.replace(/[^a-z0-9]/gi, '').toLowerCase();

  return {
    COGNITO_SUFFIX: `${repoSlug}-${env}`,
    DATABASE_NAME: `${env}_dawson`,
    DEFAULT_ACCOUNT_PASS: defaultAccountPass,
    DISABLE_EMAILS: !enableEmail ? 'true' : 'false',
    DYNAMSOFT_PRODUCT_KEYS: dynamsoftProductKeys,
    EFCMS_DOMAIN: `${env}.${repoName}.${baseDomain}`,
    EMAIL_DMARC_POLICY: emailDmarcPolicy,
    ENABLE_HEALTH_CHECKS: enableHealthChecks ? 1 : 0,
    ENV: env,
    ES_ENGINE_VERSION: opensearchEngineVersion,
    ES_INSTANCE_COUNT: opensearchInstanceCount,
    ES_INSTANCE_TYPE: opensearchInstanceType,
    ES_VOLUME_SIZE: opensearchVolumeSize,
    IRS_SUPERUSER_EMAIL:
      irsSuperuserEmail || `service.agent.${env}@example.com`,
    IS_DYNAMSOFT_ENABLED: enableDynamsoft ? 1 : 0,
    PAYMENT_PORTAL_ARN: paymentPortalArn,
    PAYMENT_PORTAL_HOST: paymentPortalHost,
    PAY_GOV_ORIGIN: payGovOrigin,
    POSTGRES_MASTER_PASSWORD: postgresOriginalPassword,
    POSTGRES_MASTER_USERNAME: postgresOriginalUsername,
    POSTGRES_USER: `${env}_dawson`,
    PROD_DOCUMENTS_BUCKET_NAME: prodDocumentsBucket,
    PROD_ENV_ACCOUNT_ID: prodAccountId,
    RDS_ENGINE_VERSION: rdsEngineVersion,
    RDS_MAX_CAPACITY: rdsMaxCapacity,
    RDS_MIN_CAPACITY: rdsMinCapacity,
    RUM_SAMPLE_RATE: rumSampleRate,
    USTC_ADMIN_PASS: adminUserPassword,
    USTC_ADMIN_USER: adminUserEmail,
    USTC_ZENDESK_USER: zendeskUserEmail,
    USTC_ZENDESK_PASS: zendeskUserPassword,
  };
};
