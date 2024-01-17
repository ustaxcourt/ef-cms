import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { confirmSignUpInteractor } from './confirmSignUpInteractor';

describe('confirmSignUpInteractor', () => {
  const confirmationCode = '123456';
  const userId = 'abc';
  const userEmail = 'example@example.com';

  beforeAll(() => {
    applicationContext.getCognito().confirmSignUp.mockResolvedValue({});
  });

  it('should call cognito confirmSignUp with correctly formatted parameters', async () => {
    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode.mockResolvedValue({ confirmationCode });

    applicationContext.getCognito().adminConfirmSignUp.mockResolvedValue({});

    applicationContext.getCognito().listUsers.mockResolvedValue({
      users: {
        Users: [
          {
            Attributes: {
              Name: 'example',
            },
          },
        ],
      },
    });

    await confirmSignUpInteractor(applicationContext, {
      confirmationCode,
      userEmail,
      userId,
    });

    expect(
      applicationContext.getCognito().adminConfirmSignUp,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalled();
  });

  it('should return an error when confirmSignUp fails', async () => {
    applicationContext
      .getCognito()
      .adminConfirmSignUp.mockRejectedValue(new Error());

    await expect(
      confirmSignUpInteractor(applicationContext, {
        confirmationCode,
        userEmail,
        userId,
      }),
    ).rejects.toThrow();
    expect(
      applicationContext.getCognito().adminConfirmSignUp,
    ).toHaveBeenCalled();
  });
});
