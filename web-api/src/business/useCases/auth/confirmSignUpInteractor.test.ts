import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { confirmSignUpInteractor } from './confirmSignUpInteractor';

describe('confirmSignUpInteractor', () => {
  const confirmationCode = '123456';
  const userEmail = 'example@example.com';

  beforeAll(() => {
    applicationContext.getCognito().confirmSignUp.mockResolvedValue({});
  });

  it('should call cognito confirmSignUp with correctly formatted parameters and return the result', async () => {
    const result = await confirmSignUpInteractor(applicationContext, {
      confirmationCode,
      userEmail,
    });

    expect(
      applicationContext.getCognito().confirmSignUp.mock.calls[0][0],
    ).toMatchObject({
      ConfirmationCode: confirmationCode,
      Username: userEmail,
    });
    expect(result).toEqual({});
  });

  it('should return an error when confirmSignUp fails', async () => {
    applicationContext
      .getCognito()
      .confirmSignUp.mockRejectedValue(new Error());

    await expect(
      confirmSignUpInteractor(applicationContext, {
        confirmationCode,
        userEmail,
      }),
    ).rejects.toThrow();
    expect(applicationContext.getCognito().confirmSignUp).toHaveBeenCalled();
  });
});
