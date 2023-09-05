import { applicationContext } from '../../test/createTestApplicationContext';
import { createUserInteractorLocal } from './createUserInteractorLocal';

describe('createUserInteractorLocal', () => {
  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const userId = 'abc123';
  const password = 'Pa$$word!';
  const user = { email, name, password };

  // cognito returns an empty 200 on success
  const confirmSignUpResult = {};
  beforeAll(() => {
    applicationContext.getCognito().signUp.mockReturnValue({
      promise: () => confirmSignUpResult,
    });
    applicationContext.getUniqueId.mockReturnValue(userId);
  });

  it('should call cognito signUp with correctly formatted parameters and return the result', async () => {
    const expectedParams = {
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'custom:role',
          Value: 'petitioner',
        },
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'custom:userId',
          Value: userId,
        },
      ],
      Username: email,
    };

    const result = await createUserInteractorLocal(applicationContext, {
      user,
    });

    expect(
      applicationContext.getCognito().signUp.mock.calls[0][0],
    ).toMatchObject(expectedParams);

    expect(result).toEqual({});
  });

  it('should return an error if signUp fails', async () => {
    applicationContext.getCognito().signUp.mockReturnValueOnce({
      promise: () => {
        throw new Error();
      },
    });

    await expect(
      createUserInteractorLocal(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).toHaveBeenCalled();
  });
});
