import {
  ChallengeNameType,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { changePassword } from '@web-api/gateways/user/changePassword';

describe('changePassword', () => {
  it('should make a call to update the password for the account with their email lowercased', async () => {
    const mockEmail = 'tESt@example.com';
    const lowerCaseEmail = 'test@example.com';
    const mockNewPassword = 'P@ssw0rd';
    const mockCode = 'afde08bd-7ccc-4163-9242-87f78cbb2452';
    const mockCognitoClientId = 'test';
    applicationContext.environment.cognitoClientId = mockCognitoClientId;
    applicationContext.getCognito().adminGetUser.mockResolvedValue({
      UserStatus: UserStatusType.CONFIRMED,
    });

    await changePassword(applicationContext, {
      code: mockCode,
      email: mockEmail,
      newPassword: mockNewPassword,
    });

    expect(
      applicationContext.getCognito().confirmForgotPassword,
    ).toHaveBeenCalledWith({
      ClientId: mockCognitoClientId,
      ConfirmationCode: mockCode,
      Password: mockNewPassword,
      Username: lowerCaseEmail,
    });
  });

  it('should update the user`s password in persistence when they are in NEW_PASSWORD_REQUIRED state and their change password request is valid', async () => {
    const mockSession = 'test';
    const mockEmail = 'test@example.com';
    const mockPassword = '123';
    applicationContext.getCognito().adminGetUser.mockResolvedValue({
      UserStatus: UserStatusType.FORCE_CHANGE_PASSWORD,
    });
    applicationContext.getCognito().initiateAuth.mockResolvedValue({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      Session: mockSession,
    });

    await changePassword(applicationContext, {
      code: mockPassword,
      email: mockEmail,
      newPassword: mockPassword,
    });

    expect(
      applicationContext.getCognito().respondToAuthChallenge,
    ).toHaveBeenCalledWith({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ChallengeResponses: {
        NEW_PASSWORD: mockPassword,
        USERNAME: mockEmail,
      },
      ClientId: applicationContext.environment.cognitoClientId,
      Session: 'test',
    });
  });
});
