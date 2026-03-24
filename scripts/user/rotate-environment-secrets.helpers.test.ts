import { STSClient } from '@aws-sdk/client-sts';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { SSMClient } from '@aws-sdk/client-ssm';
import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  invokePasswordUpdateLambdaInVaultAccount,
  loadSecrets,
  rotateSecrets,
} from './rotate-environment-secrets.helpers';
import { makeNewPassword as makeNewPasswordHelper } from './make-new-password';

jest.mock('@aws-sdk/client-sts');
jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('@aws-sdk/client-lambda');
jest.mock('@aws-sdk/client-ssm');
jest.mock('@aws-sdk/client-secrets-manager');
jest.mock('./make-new-password');

const secretsManagerClient = SecretsManagerClient as jest.Mock;
const makeNewPassword = makeNewPasswordHelper as jest.Mock;
const cognitoIdentityProvider = CognitoIdentityProvider as jest.Mock;
const stsClient = STSClient as jest.Mock;
const ssmClient = SSMClient as jest.Mock;
const lambdaClient = LambdaClient as jest.Mock;

describe('rotate-environment-secrets.helpers', () => {
  const mockRegion = 'us-east-1';
  const mockUserPoolId = 'us-east-1_abc123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('loadSecrets', () => {
    it('returns parsed secrets when SecretString is present', async () => {
      const mockSecrets = { key: 'value' };
      const mockResponse = jest.fn().mockResolvedValue({
        SecretString: JSON.stringify(mockSecrets),
      });
      secretsManagerClient.mockImplementation(() => ({
        send: mockResponse,
      }));

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
      const mockResponse = jest.fn().mockResolvedValue({});
      secretsManagerClient.mockImplementation(() => ({
        send: mockResponse,
      }));

      await expect(
        loadSecrets({
          region: mockRegion,
          secretsName: 'not-the-mock-secrets',
        }),
      ).rejects.toThrow('could not load secrets for not-the-mock-secrets');
    });
  });

  describe('rotateSecrets', () => {
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

      const secretsManagerSendMock = jest
        .fn()
        .mockResolvedValueOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .mockResolvedValueOnce({}) // putSecretValue(env_deploy)
        .mockResolvedValueOnce({
          SecretString: JSON.stringify(mockZendeskSecrets),
        }) // loadSecrets(ZendeskDawson)
        .mockResolvedValueOnce({}); // putSecretValue(ZendeskDawson)

      secretsManagerClient.mockImplementation(() => ({
        send: secretsManagerSendMock,
      }));

      const cognitoAdminSetUserPasswordMock = jest.fn().mockResolvedValue({});
      cognitoIdentityProvider.mockImplementation(() => ({
        adminSetUserPassword: cognitoAdminSetUserPasswordMock,
      }));

      const stsCredentialsMockResponse = jest.fn().mockResolvedValue({
        Credentials: {
          AccessKeyId: 'accessKeyId',
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });
      stsClient.mockImplementation(() => ({
        send: stsCredentialsMockResponse,
      }));

      const ssmSendMock = jest.fn().mockResolvedValue({});
      ssmClient.mockImplementation(() => ({
        send: ssmSendMock,
      }));

      const lambdaSendMock = jest.fn().mockResolvedValue({
        Payload: Buffer.from(JSON.stringify({ status: 'success' })),
      });
      lambdaClient.mockImplementation(() => ({
        send: lambdaSendMock,
      }));

      await rotateSecrets({
        ci: 'true',
        env: 'test',
        region: mockRegion,
        UserPoolId: mockUserPoolId,
      });

      expect(cognitoAdminSetUserPasswordMock).toHaveBeenCalledWith({
        Password: 'new-admin-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'admin',
      });
      expect(cognitoAdminSetUserPasswordMock).toHaveBeenCalledWith({
        Password: 'new-zendesk-pass',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'zendesk',
      });

      expect(secretsManagerSendMock).toHaveBeenCalledTimes(4);
      expect(PutSecretValueCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          SecretId: 'test_deploy',
          SecretString: expect.stringContaining(
            '"DEFAULT_ACCOUNT_PASS":"new-default-pass"',
          ),
        }),
      );
      expect(PutSecretValueCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          SecretId: 'test/ZendeskDawson',
          SecretString: expect.stringContaining(
            '"USTC_ZENDESK_PASS":"new-zendesk-pass"',
          ),
        }),
      );
    });

    it('rotates secrets for dev environment without CI', async () => {
      const mockSecrets = {
        USTC_ADMIN_USER: 'admin',
        USTC_ZENDESK_USER: 'zendesk',
      };

      const secretsManagerSendMock = jest
        .fn()
        .mockResolvedValueOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .mockResolvedValueOnce({}) // putSecretValue(env_deploy)
        .mockRejectedValueOnce(new Error('No Zendesk secrets')); // loadSecrets(ZendeskDawson) failure

      secretsManagerClient.mockImplementation(() => ({
        send: secretsManagerSendMock,
      }));

      const cognitoAdminSetUserPasswordMock = jest.fn().mockResolvedValue({});
      cognitoIdentityProvider.mockImplementation(() => ({
        adminSetUserPassword: cognitoAdminSetUserPasswordMock,
      }));

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
      expect(cognitoAdminSetUserPasswordMock).toHaveBeenCalledTimes(2);
      expect(secretsManagerSendMock).toHaveBeenCalledTimes(3);
    });

    it('handles missing Zendesk secrets', async () => {
      const mockSecrets = {
        USTC_ADMIN_USER: 'admin',
        USTC_ZENDESK_USER: 'zendesk',
      };

      const secretsManagerSendMock = jest
        .fn()
        .mockResolvedValueOnce({ SecretString: JSON.stringify(mockSecrets) }) // loadSecrets(env_deploy)
        .mockResolvedValueOnce({}) // putSecretValue(env_deploy)
        .mockResolvedValueOnce({}); // loadSecrets(ZendeskDawson) returns no SecretString

      secretsManagerClient.mockImplementation(() => ({
        send: secretsManagerSendMock,
      }));

      const cognitoAdminSetUserPasswordMock = jest.fn().mockResolvedValue({});
      cognitoIdentityProvider.mockImplementation(() => ({
        adminSetUserPassword: cognitoAdminSetUserPasswordMock,
      }));

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
      const stsSendMock = jest.fn().mockResolvedValue({});
      stsClient.mockImplementation(() => ({
        send: stsSendMock,
      }));

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

    it('throws an error if lambda invocation fails to return a payload', async () => {
      const stsSendMock = jest.fn().mockResolvedValue({
        Credentials: {
          AccessKeyId: 'accessKeyId',
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });
      stsClient.mockImplementation(() => ({
        send: stsSendMock,
      }));

      const ssmSendMock = jest.fn().mockResolvedValue({});
      ssmClient.mockImplementation(() => ({
        send: ssmSendMock,
      }));

      const lambdaSendMock = jest.fn().mockResolvedValue({});
      lambdaClient.mockImplementation(() => ({
        send: lambdaSendMock,
      }));

      await expect(
        invokePasswordUpdateLambdaInVaultAccount({
          env: 'test',
          newPassword: 'password',
          region: mockRegion,
          vaultAccountId: '123456789012',
        }),
      ).rejects.toThrow('Lambda invocation failed to return a payload');
    });

    it('returns the parsed payload on success', async () => {
      const stsSendMock = jest.fn().mockResolvedValue({
        Credentials: {
          AccessKeyId: 'accessKeyId',
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });
      stsClient.mockImplementation(() => ({
        send: stsSendMock,
      }));

      const ssmSendMock = jest.fn().mockResolvedValue({});
      ssmClient.mockImplementation(() => ({
        send: ssmSendMock,
      }));

      const mockResponse = { status: 'success' };
      const lambdaSendMock = jest.fn().mockResolvedValue({
        Payload: Buffer.from(JSON.stringify(mockResponse)),
      });
      lambdaClient.mockImplementation(() => ({
        send: lambdaSendMock,
      }));

      const result = await invokePasswordUpdateLambdaInVaultAccount({
        env: 'test',
        newPassword: 'password',
        region: mockRegion,
        vaultAccountId: '123456789012',
      });

      expect(result).toEqual(mockResponse);
      expect(STSClient).toHaveBeenCalled();
      expect(SSMClient).toHaveBeenCalled();
      expect(LambdaClient).toHaveBeenCalled();
    });
  });
});
