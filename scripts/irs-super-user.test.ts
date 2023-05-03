import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { login, registerUser } from './irs-super-user';

jest.mock('../shared/admin-tools/util', () => ({
  askQuestion: jest.fn(() => {
    return new Promise(resolve => {
      resolve('001234');
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
    expect(cognitoClient).toHaveBeenCalledTimes(2);
  });
});
describe('login', () => {
  it('Logs a user in with MFA', async () => {
    cognitoClient
      .mockReturnValueOnce({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        Session: 'irs-super-user.login.test',
      })
      .mockReturnValueOnce({
        Session: 'irs-super-user.login.test',
      });
    await login();
    expect(cognitoClient).toHaveBeenCalledTimes(2);
  });
});
