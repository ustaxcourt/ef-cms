import {
  CreateSecretCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';
import { cloneDeep } from 'lodash';
import { parseArgsAndEnvVars } from '../helpers/parseArgsAndEnvVars';

jest.mock('./createSecretsHelpers', () => ({
  getRepoName: jest.fn(),
}));

jest.mock('../user/make-new-password', () => ({
  makeNewPassword: jest.fn(),
}));

import { getRepoName as getRepoNameMock } from './createSecretsHelpers';
import { makeNewPassword as makeNewPasswordMock } from '../user/make-new-password';
import {
  createEnvSecrets,
  createEnvSecretsScriptConfig,
  type CreateEnvSecretsParams,
} from './create-env-secrets.helpers';

const secretsManagerMock = mockClient(SecretsManagerClient);
const getRepoName = jest.mocked(getRepoNameMock);
const makeNewPassword = jest.mocked(makeNewPasswordMock);

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

const baseParams: CreateEnvSecretsParams = {
  adminUserEmail: 'ustcadmin@example.com',
  baseDomain: 'example.com',
  dynamsoftProductKeys: 'noop',
  emailDmarcPolicy: 'none',
  enableDynamsoft: false,
  enableEmail: false,
  enableHealthChecks: false,
  env: 'exp1',
  generateSecureDefaultAccountPassword: false,
  opensearchEngineVersion: 'OpenSearch_3.7',
  opensearchInstanceCount: 1,
  opensearchInstanceType: 't3.small.search',
  opensearchVolumeSize: 10,
  paymentPortalArn: 'arn:aws:execute-api:us-east-1:123:abc',
  paymentPortalHost: 'https://payment.example.com',
  payGovOrigin: 'https://paygov.example.com',
  postgresOriginalUsername: 'master',
  prodAccountId: '123456789012',
  prodDocumentsBucket: 'prod-documents',
  rdsEngineVersion: '17.5',
  rdsMaxCapacity: '1',
  rdsMinCapacity: '0.5',
  region: 'us-east-1',
  rumSampleRate: '1',
  update: false,
  zendeskUserEmail: 'ustczendesk@dawson.ustaxcourt.gov',
};

const expectedEnvSecrets = {
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
  RDS_ENGINE_VERSION: '17.5',
  RDS_MAX_CAPACITY: '1',
  RDS_MIN_CAPACITY: '0.5',
  RUM_SAMPLE_RATE: '1',
  USTC_ADMIN_PASS: 'admin-pass',
  USTC_ADMIN_USER: 'ustcadmin@example.com',
  USTC_ZENDESK_USER: 'ustczendesk@dawson.ustaxcourt.gov',
  USTC_ZENDESK_PASS: 'zendesk-pass',
};

describe('create-env-secrets.helpers', () => {
  const originalArgv = cloneDeep(process.argv);
  const originalEnv = cloneDeep(process.env);

  beforeEach(() => {
    secretsManagerMock.reset();
    getRepoName.mockReset();
    makeNewPassword.mockReset();
    process.argv = [...requiredArgv];
    process.env = {
      AWS_PROFILE: 'ustc-dev',
    };
    getRepoName.mockResolvedValue('ef-cms');
    makeNewPassword
      .mockReturnValueOnce('admin-pass')
      .mockReturnValueOnce('postgres-pass')
      .mockReturnValueOnce('zendesk-pass');
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
  });

  describe('createEnvSecretsScriptConfig / parseArgsAndEnvVars', () => {
    it('defaults rdsEngineVersion to 17.5', () => {
      const { rdsEngineVersion } = parseArgsAndEnvVars(
        createEnvSecretsScriptConfig,
      ) as { rdsEngineVersion: string };

      expect(rdsEngineVersion).toEqual('17.5');
    });

    it('honors an explicit --rds-engine-version override', () => {
      process.argv = [...requiredArgv, '--rds-engine-version', '17.10'];

      const { rdsEngineVersion } = parseArgsAndEnvVars(
        createEnvSecretsScriptConfig,
      ) as { rdsEngineVersion: string };

      expect(rdsEngineVersion).toEqual('17.10');
    });
  });

  describe('createEnvSecrets', () => {
    it('creates a new deploy secret with the expected payload', async () => {
      secretsManagerMock.on(CreateSecretCommand).resolves({});

      await createEnvSecrets(baseParams);

      expect(secretsManagerMock.commandCalls(CreateSecretCommand)).toHaveLength(
        1,
      );
      expect(
        secretsManagerMock.commandCalls(CreateSecretCommand)[0].args[0].input,
      ).toEqual({
        Description: 'Environment variables for the exp1 environment',
        Name: 'exp1_deploy',
        SecretString: JSON.stringify(expectedEnvSecrets),
      });
      expect(
        secretsManagerMock.commandCalls(PutSecretValueCommand),
      ).toHaveLength(0);
      expect(makeNewPassword).toHaveBeenCalledTimes(3);
      expect(makeNewPassword).toHaveBeenNthCalledWith(
        2,
        ['uppercase', 'lowercase', 'numbers'],
        42,
      );
    });

    it('updates an existing deploy secret when update is true', async () => {
      secretsManagerMock.on(PutSecretValueCommand).resolves({});

      await createEnvSecrets({
        ...baseParams,
        update: true,
      });

      expect(
        secretsManagerMock.commandCalls(PutSecretValueCommand),
      ).toHaveLength(1);
      expect(
        secretsManagerMock.commandCalls(PutSecretValueCommand)[0].args[0].input,
      ).toEqual({
        SecretId: 'exp1_deploy',
        SecretString: JSON.stringify(expectedEnvSecrets),
      });
      expect(secretsManagerMock.commandCalls(CreateSecretCommand)).toHaveLength(
        0,
      );
    });

    it('generates a secure default account password when requested', async () => {
      secretsManagerMock.on(CreateSecretCommand).resolves({});
      makeNewPassword.mockReset();
      makeNewPassword
        .mockReturnValueOnce('admin-pass')
        .mockReturnValueOnce('secure-default-pass')
        .mockReturnValueOnce('postgres-pass')
        .mockReturnValueOnce('zendesk-pass');

      await createEnvSecrets({
        ...baseParams,
        generateSecureDefaultAccountPassword: true,
      });

      const secretString =
        secretsManagerMock.commandCalls(CreateSecretCommand)[0].args[0].input
          .SecretString!;
      expect(JSON.parse(secretString).DEFAULT_ACCOUNT_PASS).toEqual(
        'secure-default-pass',
      );
      expect(makeNewPassword).toHaveBeenCalledTimes(4);
    });

    it('uses the provided irsSuperuserEmail and enabled flags', async () => {
      secretsManagerMock.on(CreateSecretCommand).resolves({});

      await createEnvSecrets({
        ...baseParams,
        enableDynamsoft: true,
        enableEmail: true,
        enableHealthChecks: true,
        irsSuperuserEmail: 'irs@example.com',
      });

      const secretString =
        secretsManagerMock.commandCalls(CreateSecretCommand)[0].args[0].input
          .SecretString!;
      const secrets = JSON.parse(secretString);

      expect(secrets.IRS_SUPERUSER_EMAIL).toEqual('irs@example.com');
      expect(secrets.DISABLE_EMAILS).toEqual('false');
      expect(secrets.ENABLE_HEALTH_CHECKS).toEqual(1);
      expect(secrets.IS_DYNAMSOFT_ENABLED).toEqual(1);
    });

    it('exits when env is prod', async () => {
      await createEnvSecrets({
        ...baseParams,
        env: 'prod',
      });

      expect(console.log).toHaveBeenCalledWith('Do not use in prod');
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(secretsManagerMock.commandCalls(CreateSecretCommand)).toHaveLength(
        0,
      );
    });
  });
});
