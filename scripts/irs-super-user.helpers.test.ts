import {
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { askQuestion } from '../shared/admin-tools/util';
import { cloneDeep } from 'lodash';
import { login, registerUser } from './irs-super-user.helpers';

const mockTOTP = '001234';

jest.mock('./helpers/parseArgsAndEnvVars', () => {
  const mockEnvironment = {
    ClientId: 'jest-irs-client-id',
    email: 'jest-irs-superuser@example.com',
    env: 'jest',
    password: 'opensesame',
  };
  return {
    getEnvironmentVariables: jest.fn().mockReturnValue(mockEnvironment),
    parseArgsAndEnvVars: jest.fn().mockReturnValue(mockEnvironment),
  };
});
jest.mock('../shared/admin-tools/util', () => ({
  askQuestion: jest.fn(() => {
    return new Promise(resolve => {
      resolve(mockTOTP);
    });
  }),
  requireEnvVars: jest.fn(),
}));
jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    AssociateSoftwareTokenCommand: class {},
    CognitoIdentityProviderClient: class {
      send() {
        return new Promise(resolve => {
          resolve(true);
        });
      }
    },
    InitiateAuthCommand: class {},
    RespondToAuthChallengeCommand: class {},
    VerifySoftwareTokenCommand: class {},
  };
});

const cognito = Object.getPrototypeOf(
  new CognitoIdentityProviderClient({ region: 'us-east-1' }),
);
const cognitoClient = jest.spyOn(cognito, 'send');

describe('irs-super-user', () => {
  const originalArgv = cloneDeep(process.argv);
  const originalEnv = cloneDeep(process.env);
  beforeEach(() => {
    jest.resetAllMocks();
    process.argv = ['ts-node', 'irs-super-user.ts'];
    process.env = {
      DEFAULT_ACCOUNT_PASS: 'opensesame',
      ENV: 'jest',
      IRS_CLIENT_ID: 'jest-irs-client-id',
      IRS_SUPERUSER_EMAIL: 'jest-irs-superuser@example.com',
    };
  });
  afterAll(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
  });
  describe('registerUser', () => {
    it('Sets a new password and enrolls the user in MFA', async () => {
      cognitoClient
        .mockReturnValueOnce({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: 'irs-super-user.registerUser.test',
        })
        .mockReturnValueOnce({
          Session: 'irs-super-user.registerUser.test',
        })
        .mockReturnValueOnce({
          ChallengeName: 'MFA_SETUP',
          Session: 'irs-super-user.registerUser.test',
        })
        .mockReturnValueOnce({
          SecretCode: 'SuperDuperSecretCode',
          Session: 'irs-super-user.registerUser.test',
        })
        .mockReturnValueOnce({
          Session: 'irs-super-user.registerUser.test',
        });
      await registerUser();
      expect(cognitoClient).toHaveBeenCalledTimes(5);
    });
    it('Skips MFA setup if the user is already enrolled in MFA', async () => {
      cognitoClient
        .mockReturnValueOnce({
          Session: 'irs-super-user.registerUser.test',
        })
        .mockReturnValueOnce({
          Session: 'irs-super-user.registerUser.test',
        });
      await registerUser();
      expect(cognitoClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('throws an error if authResponse is not SOFTWARE_TOKEN_MFA', async () => {
      cognitoClient.mockReturnValue({
        ChallengeName: 'SOME_OTHER_CHALLENGE',
      });
      await expect(login()).rejects.toThrow();
    });

    it('Logs a user in with MFA', async () => {
      const mockSessionResponse = 'irs-super-user.login.test';
      cognitoClient
        .mockReturnValueOnce({
          ChallengeName: 'SOFTWARE_TOKEN_MFA',
          Session: mockSessionResponse,
        })
        .mockReturnValueOnce({
          Session: 'irs-super-user3.login.test',
        });
      await login();

      expect(askQuestion).toHaveBeenCalled();

      expect(cognitoClient).toHaveBeenCalledTimes(2);
      expect(cognitoClient).toHaveBeenCalledWith(
        new RespondToAuthChallengeCommand({
          ChallengeName: 'SOFTWARE_TOKEN_MFA',
          ChallengeResponses: {
            SOFTWARE_TOKEN_MFA_CODE: mockTOTP,
            USERNAME: process.env.IRS_SUPERUSER_EMAIL!,
          },
          ClientId: process.env.IRS_CLIENT_ID!,
          Session: mockSessionResponse,
        }),
      );
    });
  });
});
