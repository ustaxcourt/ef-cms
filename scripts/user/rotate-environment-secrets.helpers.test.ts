import {
  AdminSetUserPasswordCommand,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  invokePasswordUpdateLambdaInVaultAccount,
  loadSecrets,
  rotateSecrets,
} from './rotate-environment-secrets.helpers';
import { makeNewPassword as makeNewPasswordHelper } from './make-new-password';
import { mockClient } from 'aws-sdk-client-mock';

jest.mock('@aws-sdk/client-sts');
jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('@aws-sdk/client-lambda');
jest.mock('@aws-sdk/client-ssm');
jest.mock('@aws-sdk/client-secrets-manager');
jest.mock('./make-new-password');

const secretsManagerClient = mockClient(SecretsManagerClient);
const makeNewPassword = jest.mocked(makeNewPasswordHelper);
const cognitoIdentityProvider = mockClient(CognitoIdentityProvider);
const stsClient = mockClient(STSClient);
const ssmClient = mockClient(SSMClient);
const lambdaClient = mockClient(LambdaClient);

const resetMocks = () => {
  secretsManagerClient.reset();
  cognitoIdentityProvider.reset();
  stsClient.reset();
  ssmClient.reset();
  lambdaClient.reset();
};

const mockLambdaInvocationResponse = {
  StatusCode: 202,
  $metadata: {
    httpStatusCode: 202,
    requestId: 'e69a657f-b670-46f9-ae04-9e9f1edc3ccc',
    attempts: 1,
    totalRetryDelay: 0,
  },
};

describe('rotate-environment-secrets.helpers', () => {
  const mockRegion = 'us-east-1';
  const mockUserPoolId = 'us-east-1_abc123';

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('loadSecrets', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetMocks();
    });
    it('returns parsed secrets when SecretString is present', async () => {
      const mockSecrets = { key: 'value' };
      secretsManagerClient.on(GetSecretValueCommand).resolvesOnce({
        SecretString: JSON.stringify(mockSecrets),
      });

      const result = await loadSecrets({
        region: mockRegion,
        secretsName: 'mock-secrets',
      });

      expect(result).toEqual(mockSecrets);
      expect(GetSecretValueCommand).toHaveBeenCalledWith({
        SecretId: 'mock-secrets',
      });
    });

    it('throws an error when SecretString is missing', async () => {
      secretsManagerClient.on(GetSecretValueCommand).resolvesOnce({});

      await expect(
        loadSecrets({
          region: mockRegion,
          secretsName: 'not-the-mock-secrets',
        }),
      ).rejects.toThrow('could not load secrets for not-the-mock-secrets');
    });
  });

  describe('rotateSecrets', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetMocks();
    });
    it('rotates secrets for test environment with CI', async () => {
      const mockSecrets = {
        USTC_ADMIN_USER: 'admin',
        USTC_ZENDESK_USER: 'zendesk',
        VAULT_ACCOUNT_ID: '123456789012',
      };
      const mockZendeskSecrets = {
        existing: 'value',
      };

      makeNewPassword
        .mockReturnValueOnce('new-default-pass')
        .mockReturnValueOnce('new-admin-pass')
        .mockReturnValueOnce('new-zendesk-pass');

      secretsManagerClient
        .on(GetSecretValueCommand)
        .resolvesOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .resolvesOnce({ SecretString: JSON.stringify(mockZendeskSecrets) }); // loadSecrets(ZendeskDawson)
      secretsManagerClient
        .on(PutSecretValueCommand)
        .resolvesOnce({}) // putSecretValue(env_deploy)
        .resolvesOnce({}); // putSecretValue(ZendeskDawson)

      cognitoIdentityProvider.on(AdminSetUserPasswordCommand).resolves({});

      stsClient.on(AssumeRoleCommand).resolvesOnce({
        Credentials: {
          AccessKeyId: 'accessKeyId',
          Expiration: undefined,
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });

      ssmClient.on(PutParameterCommand).resolvesOnce({});

      lambdaClient.on(InvokeCommand).resolvesOnce(mockLambdaInvocationResponse);

      await rotateSecrets({
        ci: 'true',
        env: 'test',
        region: mockRegion,
        UserPoolId: mockUserPoolId,
      });

      expect(AdminSetUserPasswordCommand).toHaveBeenCalledTimes(2);
      expect(AdminSetUserPasswordCommand).toHaveBeenNthCalledWith(1, {
        Password: 'new-admin-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'admin',
      });
      expect(AdminSetUserPasswordCommand).toHaveBeenNthCalledWith(2, {
        Password: 'new-zendesk-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'zendesk',
      });

      expect(GetSecretValueCommand).toHaveBeenCalledTimes(2);
      expect(GetSecretValueCommand).toHaveBeenNthCalledWith(1, {
        SecretId: 'test_deploy',
      });
      expect(GetSecretValueCommand).toHaveBeenNthCalledWith(2, {
        SecretId: 'test/ZendeskDawson',
      });

      expect(PutSecretValueCommand).toHaveBeenCalledTimes(2);
      expect(PutSecretValueCommand).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          SecretId: 'test_deploy',
          SecretString: expect.stringContaining(
            '"DEFAULT_ACCOUNT_PASS":"new-default-pass"',
          ),
        }),
      );
      expect(PutSecretValueCommand).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          SecretId: 'test/ZendeskDawson',
          SecretString: expect.stringContaining(
            '"USTC_ZENDESK_PASS":"new-zendesk-pass"',
          ),
        }),
      );

      expect(AssumeRoleCommand).toHaveBeenCalledWith({
        RoleArn: `arn:aws:iam::${mockSecrets.VAULT_ACCOUNT_ID}:role/vaultwarden-password-rotator`,
        RoleSessionName: 'RotationSession',
      });

      expect(SSMClient).toHaveBeenCalledWith({
        credentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
          sessionToken: 'sessionToken',
        },
        region: mockRegion,
      });
      expect(PutParameterCommand).toHaveBeenCalledWith({
        Name: '/vaultwarden/dawson/test',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'new-default-pass',
      });

      expect(LambdaClient).toHaveBeenCalledWith({
        credentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
          sessionToken: 'sessionToken',
        },
        region: mockRegion,
      });
      expect(InvokeCommand).toHaveBeenCalledWith({
        FunctionName: `arn:aws:lambda:${mockRegion}:${mockSecrets.VAULT_ACCOUNT_ID}:function:vaultwarden-rotate-passwords`,
        InvocationType: 'Event',
        Payload: expect.any(Buffer),
      });
    });

    it('rotates secrets for dev environment without CI', async () => {
      const mockSecrets = {
        USTC_ADMIN_USER: 'admin',
        USTC_ZENDESK_USER: 'zendesk',
      };

      makeNewPassword
        .mockReturnValueOnce('new-admin-pass')
        .mockReturnValueOnce('new-zendesk-pass');

      secretsManagerClient
        .on(GetSecretValueCommand)
        .resolvesOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .rejectsOnce(new Error('No Zendesk secrets')); // loadSecrets(ZendeskDawson) failure
      secretsManagerClient.on(PutSecretValueCommand).resolvesOnce({}); // putSecretValue(env_deploy)

      cognitoIdentityProvider.on(AdminSetUserPasswordCommand).resolves({});

      await rotateSecrets({
        ci: '',
        env: 'dev',
        region: mockRegion,
        UserPoolId: mockUserPoolId,
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
          DEFAULT_ACCOUNT_PASS: 'Testing1234$',
        }),
      );
      expect(AdminSetUserPasswordCommand).toHaveBeenCalledTimes(2);
      expect(AdminSetUserPasswordCommand).toHaveBeenNthCalledWith(1, {
        Password: 'new-admin-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'admin',
      });
      expect(AdminSetUserPasswordCommand).toHaveBeenNthCalledWith(2, {
        Password: 'new-zendesk-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'zendesk',
      });

      expect(GetSecretValueCommand).toHaveBeenCalledTimes(2);
      expect(GetSecretValueCommand).toHaveBeenNthCalledWith(1, {
        SecretId: 'dev_deploy',
      });
      expect(GetSecretValueCommand).toHaveBeenNthCalledWith(2, {
        SecretId: 'dev/ZendeskDawson',
      });

      expect(PutSecretValueCommand).toHaveBeenCalledTimes(1);
      expect(PutSecretValueCommand).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          SecretId: 'dev_deploy',
          SecretString: expect.stringContaining(
            '"DEFAULT_ACCOUNT_PASS":"Testing1234$"',
          ),
        }),
      );

      expect(STSClient).not.toHaveBeenCalled();
      expect(AssumeRoleCommand).not.toHaveBeenCalled();
      expect(SSMClient).not.toHaveBeenCalled();
      expect(PutParameterCommand).not.toHaveBeenCalled();
      expect(LambdaClient).not.toHaveBeenCalled();
      expect(InvokeCommand).not.toHaveBeenCalled();
    });

    it('handles missing Zendesk secrets', async () => {
      const mockSecrets = {
        USTC_ADMIN_USER: 'admin',
        USTC_ZENDESK_USER: 'zendesk',
      };

      secretsManagerClient
        .on(GetSecretValueCommand)
        .resolvesOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .resolvesOnce({}); // loadSecrets(ZendeskDawson) returns no SecretString
      secretsManagerClient.on(PutSecretValueCommand).resolvesOnce({}); // putSecretValue(env_deploy)

      cognitoIdentityProvider.on(AdminSetUserPasswordCommand).resolves({});

      await rotateSecrets({
        ci: 'true',
        env: 'unsupported',
        region: mockRegion,
        UserPoolId: mockUserPoolId,
      });

      expect(console.log).toHaveBeenCalledWith('No Zendesk secrets found');
    });
  });

  describe('invokePasswordUpdateLambdaInVaultAccount', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetMocks();
    });
    it('throws an error if the environment is unsupported', async () => {
      await expect(
        invokePasswordUpdateLambdaInVaultAccount({
          env: 'unsupported',
          newPassword: 'password',
          region: mockRegion,
          vaultAccountId: '123456789012',
        }),
      ).rejects.toThrow(
        'Could not get lambda parameters for unsupported environment: unsupported environment',
      );
    });

    it('throws an error if credentials fail to return', async () => {
      stsClient.on(AssumeRoleCommand).resolves({});

      await expect(
        invokePasswordUpdateLambdaInVaultAccount({
          env: 'test',
          newPassword: 'password',
          region: mockRegion,
          vaultAccountId: '123456789012',
        }),
      ).rejects.toThrow(
        'Could not get credentials for vaultwarden-password-rotator role in the vault account',
      );
    });

    it('returns the invocation command response on success', async () => {
      stsClient.on(AssumeRoleCommand).resolvesOnce({
        Credentials: {
          AccessKeyId: 'accessKeyId',
          Expiration: undefined,
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });

      ssmClient.on(PutParameterCommand).resolvesOnce({});

      lambdaClient.on(InvokeCommand).resolves(mockLambdaInvocationResponse);

      const result = await invokePasswordUpdateLambdaInVaultAccount({
        env: 'test',
        newPassword: 'password',
        region: mockRegion,
        vaultAccountId: '123456789012',
      });

      expect(result).toEqual(mockLambdaInvocationResponse);
      expect(AssumeRoleCommand).toHaveBeenCalledTimes(1);
      expect(PutParameterCommand).toHaveBeenCalledTimes(1);
      expect(InvokeCommand).toHaveBeenCalledTimes(1);
    });
  });
});
