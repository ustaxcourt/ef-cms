import { applicationContext } from '../../test/createTestApplicationContext';
import { confirmSignUpLocalInteractor } from './confirmSignUpLocalInteractor';

describe('confirmSignUpLocalInteractor', () => {
  const confirmationCode = '123456';
  const userEmail = 'example@example.com';

  // cognito returns an empty 200 on success
  const confirmSignUpResult = {};
  beforeAll(() => {
    applicationContext.getCognito().confirmSignUp.mockReturnValue({
      promise: () => confirmSignUpResult,
    });
  });

  it('should call cognito confirmSignUp with correctly formatted parameters and return the result', async () => {
    const result = await confirmSignUpLocalInteractor(applicationContext, {
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

  it('should return an error if confirmSignUp fails', async () => {
    applicationContext.getCognito().confirmSignUp.mockReturnValueOnce({
      promise: () => {
        throw new Error();
      },
    });

    await expect(
      confirmSignUpLocalInteractor(applicationContext, {
        confirmationCode,
        userEmail,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().confirmSignUp).toHaveBeenCalled();
  });
});
