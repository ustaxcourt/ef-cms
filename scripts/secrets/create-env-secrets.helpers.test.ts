import { cloneDeep } from 'lodash';
import { parseArgsAndEnvVars } from '../helpers/parseArgsAndEnvVars';
import {
  buildDeployEnvSecrets,
  type BuildDeployEnvSecretsParams,
  createEnvSecretsScriptConfig,
} from './create-env-secrets.helpers';

const requiredArgv = [
  'ts-node',
  'create-env-secrets.ts',
  '--env',
  'exp1',
  '--domain',
  'example.com',
  '--email-dmarc-policy',
  'none',
  '--payment-portal-arn',
  'arn:aws:execute-api:us-east-1:123:abc',
  '--payment-portal-host',
  'https://payment.example.com',
  '--pay-gov-origin',
  'https://paygov.example.com',
  '--prod-account-id',
  '123456789012',
  '--prod-documents-bucket',
  'prod-documents',
];

const baseBuildParams: BuildDeployEnvSecretsParams = {
  adminUserEmail: 'ustcadmin@example.com',
  adminUserPassword: 'admin-pass',
  baseDomain: 'example.com',
  defaultAccountPass: 'Testing1234$',
  dynamsoftProductKeys: 'noop',
  emailDmarcPolicy: 'none',
  enableDynamsoft: false,
  enableEmail: false,
  enableHealthChecks: false,
  env: 'exp1',
  opensearchEngineVersion: 'OpenSearch_3.7',
  opensearchInstanceCount: 1,
  opensearchInstanceType: 't3.small.search',
  opensearchVolumeSize: 10,
  paymentPortalArn: 'arn:aws:execute-api:us-east-1:123:abc',
  paymentPortalHost: 'https://payment.example.com',
  payGovOrigin: 'https://paygov.example.com',
  postgresOriginalPassword: 'postgres-pass',
  postgresOriginalUsername: 'master',
  prodAccountId: '123456789012',
  prodDocumentsBucket: 'prod-documents',
  rdsEngineVersion: '17.10',
  rdsMaxCapacity: '1',
  rdsMinCapacity: '0.5',
  repoName: 'ef-cms',
  rumSampleRate: '1',
  zendeskUserEmail: 'ustczendesk@dawson.ustaxcourt.gov',
  zendeskUserPassword: 'zendesk-pass',
};

describe('create-env-secrets.helpers', () => {
  const originalArgv = cloneDeep(process.argv);
  const originalEnv = cloneDeep(process.env);

  beforeEach(() => {
    process.argv = [...requiredArgv];
    process.env = {
      AWS_PROFILE: 'ustc-dev',
    };
  });

  afterAll(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
  });

  describe('createEnvSecretsScriptConfig / parseArgsAndEnvVars', () => {
    it('defaults rdsEngineVersion to 17.10 so deploy secrets emit RDS_ENGINE_VERSION: 17.10', () => {
      const { rdsEngineVersion } = parseArgsAndEnvVars(
        createEnvSecretsScriptConfig,
      ) as { rdsEngineVersion: string };

      expect(rdsEngineVersion).toEqual('17.10');
      expect(
        buildDeployEnvSecrets({
          ...baseBuildParams,
          rdsEngineVersion,
        }).RDS_ENGINE_VERSION,
      ).toEqual('17.10');
    });

    it('honors an explicit --rds-engine-version override', () => {
      process.argv = [...requiredArgv, '--rds-engine-version', '17.5'];

      const { rdsEngineVersion } = parseArgsAndEnvVars(
        createEnvSecretsScriptConfig,
      ) as { rdsEngineVersion: string };

      expect(rdsEngineVersion).toEqual('17.5');
      expect(
        buildDeployEnvSecrets({
          ...baseBuildParams,
          rdsEngineVersion,
        }).RDS_ENGINE_VERSION,
      ).toEqual('17.5');
    });
  });

  describe('buildDeployEnvSecrets', () => {
    it('maps parsed values into the deploy secret payload', () => {
      const secrets = buildDeployEnvSecrets(baseBuildParams);

      expect(secrets).toEqual({
        COGNITO_SUFFIX: 'efcms-exp1',
        DATABASE_NAME: 'exp1_dawson',
        DEFAULT_ACCOUNT_PASS: 'Testing1234$',
        DISABLE_EMAILS: 'true',
        DYNAMSOFT_PRODUCT_KEYS: 'noop',
        EFCMS_DOMAIN: 'exp1.ef-cms.example.com',
        EMAIL_DMARC_POLICY: 'none',
        ENABLE_HEALTH_CHECKS: 0,
        ENV: 'exp1',
        ES_ENGINE_VERSION: 'OpenSearch_3.7',
        ES_INSTANCE_COUNT: 1,
        ES_INSTANCE_TYPE: 't3.small.search',
        ES_VOLUME_SIZE: 10,
        IRS_SUPERUSER_EMAIL: 'service.agent.exp1@example.com',
        IS_DYNAMSOFT_ENABLED: 0,
        PAYMENT_PORTAL_ARN: 'arn:aws:execute-api:us-east-1:123:abc',
        PAYMENT_PORTAL_HOST: 'https://payment.example.com',
        PAY_GOV_ORIGIN: 'https://paygov.example.com',
        POSTGRES_MASTER_PASSWORD: 'postgres-pass',
        POSTGRES_MASTER_USERNAME: 'master',
        POSTGRES_USER: 'exp1_dawson',
        PROD_DOCUMENTS_BUCKET_NAME: 'prod-documents',
        PROD_ENV_ACCOUNT_ID: '123456789012',
        RDS_ENGINE_VERSION: '17.10',
        RDS_MAX_CAPACITY: '1',
        RDS_MIN_CAPACITY: '0.5',
        RUM_SAMPLE_RATE: '1',
        USTC_ADMIN_PASS: 'admin-pass',
        USTC_ADMIN_USER: 'ustcadmin@example.com',
        USTC_ZENDESK_USER: 'ustczendesk@dawson.ustaxcourt.gov',
        USTC_ZENDESK_PASS: 'zendesk-pass',
      });
    });

    it('uses the provided irsSuperuserEmail when set', () => {
      const secrets = buildDeployEnvSecrets({
        ...baseBuildParams,
        irsSuperuserEmail: 'irs@example.com',
      });

      expect(secrets.IRS_SUPERUSER_EMAIL).toEqual('irs@example.com');
    });

    it('sets email and health-check flags when enabled', () => {
      const secrets = buildDeployEnvSecrets({
        ...baseBuildParams,
        enableDynamsoft: true,
        enableEmail: true,
        enableHealthChecks: true,
      });

      expect(secrets.DISABLE_EMAILS).toEqual('false');
      expect(secrets.ENABLE_HEALTH_CHECKS).toEqual(1);
      expect(secrets.IS_DYNAMSOFT_ENABLED).toEqual(1);
    });
  });
});
